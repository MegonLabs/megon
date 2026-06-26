import fs from "fs"

let content = fs.readFileSync("packages/server/src/session/llm.ts", "utf8")

const search1 = `    // TODO: move this to a proper hook
    const isOpenaiOauth = provider.id === "openai" && auth?.type === "oauth"`

content = content.replace(search1, "")

const search2 = `    const options: Record<string, any> = pipe(
      base,
      mergeDeep(input.model.options),
      mergeDeep(input.agent.options),
      mergeDeep(variant),
    )
    if (isOpenaiOauth) {
      options.instructions = system.join("\\n")
    }

    const isWorkflow = language instanceof GitLabWorkflowLanguageModel
    const messages = isOpenaiOauth
      ? input.messages
      : isWorkflow
        ? input.messages
        : [
            ...system.map(
              (x): ModelMessage => ({
                role: "system",
                content: x,
              }),
            ),
            ...input.messages,
          ]`

const replace2 = `    const baseOptions: Record<string, any> = pipe(
      base,
      mergeDeep(input.model.options),
      mergeDeep(input.agent.options),
      mergeDeep(variant),
    )

    const isWorkflow = language instanceof GitLabWorkflowLanguageModel
    const rawMessages: ModelMessage[] = isWorkflow
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

    const { messages, providerOptions } = ProviderTransform.transformRequest({
      model: input.model,
      auth,
      messages: rawMessages,
      options: baseOptions,
    })

    // update options reference since it is passed into streamText below
    const options = baseOptions
`

content = content.replace(search2, replace2)

const search3 = `              args.params.prompt = ProviderTransform.message(args.params.prompt, input.model, options)`
const replace3 = `              args.params.prompt = ProviderTransform.message(args.params.prompt, input.model, baseOptions)`
content = content.replace(search3, replace3)


const search4 = `      providerOptions: ProviderTransform.providerOptions(input.model, options),`
const replace4 = `      providerOptions,`
content = content.replace(search4, replace4)

fs.writeFileSync("packages/server/src/session/llm.ts", content)
