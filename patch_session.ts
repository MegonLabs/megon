import fs from "fs"

let content = fs.readFileSync("packages/server/src/server/routes/session.ts", "utf8")

const search = `  const isOpenaiOauth = provider.id === "openai" && auth?.type === "oauth"

  // Build system prompt
  const system: string[] = []
  system.push(
    [
      ...(input.agent.prompt ? [input.agent.prompt] : SystemPrompt.provider(input.model)),
      ...(input.system ?? []),
    ]
      .filter((x) => x)
      .join("\\n"),
  )

  // Build messages
  const messages = isOpenaiOauth
    ? input.messages
    : [
        ...system.map(
          (x): ModelMessage => ({
            role: "system",
            content: x,
          }),
        ),
        ...input.messages,
      ]

  // Build options
  const base = ProviderTransform.options({
    model: input.model,
    sessionID,
    providerOptions: provider.options,
  })
  const options: Record<string, any> = pipe(
    base,
    mergeDeep(input.model.options),
    mergeDeep(input.agent.options),
  )`

const replace = `  // Build system prompt
  const system: string[] = []
  system.push(
    [
      ...(input.agent.prompt ? [input.agent.prompt] : SystemPrompt.provider(input.model)),
      ...(input.system ?? []),
    ]
      .filter((x) => x)
      .join("\\n"),
  )

  // Build messages
  const rawMessages: ModelMessage[] = [
    ...system.map(
      (x): ModelMessage => ({
        role: "system",
        content: x,
      }),
    ),
    ...input.messages,
  ]

  // Build options
  const base = ProviderTransform.options({
    model: input.model,
    sessionID,
    providerOptions: provider.options,
  })
  const baseOptions: Record<string, any> = pipe(
    base,
    mergeDeep(input.model.options),
    mergeDeep(input.agent.options),
  )

  const { messages, providerOptions } = ProviderTransform.transformRequest({
    model: input.model,
    auth,
    messages: rawMessages,
    options: baseOptions,
  })`

content = content.replace(search, replace)

const streamOptionsSearch = `    maxOutputTokens: ProviderTransform.maxOutputTokens(input.model),
    providerOptions: ProviderTransform.providerOptions(input.model, options),
    abortSignal: new AbortController().signal,`

const streamOptionsReplace = `    maxOutputTokens: ProviderTransform.maxOutputTokens(input.model),
    providerOptions,
    abortSignal: new AbortController().signal,`

content = content.replace(streamOptionsSearch, streamOptionsReplace)

const transformMessageSearch = `              args.params.prompt = ProviderTransform.message(args.params.prompt, input.model, options)`
const transformMessageReplace = `              args.params.prompt = ProviderTransform.message(args.params.prompt, input.model, baseOptions)`

content = content.replace(transformMessageSearch, transformMessageReplace)


fs.writeFileSync("packages/server/src/server/routes/session.ts", content)
