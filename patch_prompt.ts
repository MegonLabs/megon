import fs from "fs"

let content = fs.readFileSync("packages/server/src/server/routes/prompt.ts", "utf8")

const search = `  const isOpenaiOauth = provider.id === "openai" && auth?.type === "oauth"
  const variant = input.variant && model.variants?.[input.variant] ? model.variants[input.variant] : {}
  const options = pipe(ProviderTransform.options({ model, sessionID }), mergeDeep(model.options), mergeDeep(variant))
  const providerOptions = isOpenaiOauth
    ? ProviderTransform.providerOptions(model, mergeDeep(options, { instructions: system.join("\\n"), store: false }))
    : ProviderTransform.providerOptions(model, options)
  const messages: ModelMessage[] = [
    ...(isOpenaiOauth
      ? []
      : system.map((content): ModelMessage => ({
          role: "system",
          content,
        }))),
    {
      role: "user",
      content: [
        "Significantly improve the following prompt for a coding agent.",
        "Make it more precise, unambiguous, and actionable.",
        "Add structure, acceptance criteria, and technical clarity where appropriate.",
        "Preserve the exact intent, all file references, @mentions, and code snippets.",
        "",
        "<prompt>",
        input.prompt,
        "</prompt>",
      ].join("\\n"),
    },
  ]`

const replace = `  const variant = input.variant && model.variants?.[input.variant] ? model.variants[input.variant] : {}
  const options = pipe(ProviderTransform.options({ model, sessionID }), mergeDeep(model.options), mergeDeep(variant))

  const rawMessages: ModelMessage[] = [
    ...system.map((content): ModelMessage => ({ role: "system", content })),
    {
      role: "user",
      content: [
        "Significantly improve the following prompt for a coding agent.",
        "Make it more precise, unambiguous, and actionable.",
        "Add structure, acceptance criteria, and technical clarity where appropriate.",
        "Preserve the exact intent, all file references, @mentions, and code snippets.",
        "",
        "<prompt>",
        input.prompt,
        "</prompt>",
      ].join("\\n"),
    },
  ]

  const { messages: transformedMessages, providerOptions } = ProviderTransform.transformRequest({
    model,
    auth,
    messages: rawMessages,
    options,
  })

  const messages = ProviderTransform.message(transformedMessages, model, options)`

content = content.replace(search, replace)

const reqMessagesSearch = `    messages: ProviderTransform.message(messages, model, options),`
const reqMessagesReplace = `    messages,`
content = content.replace(reqMessagesSearch, reqMessagesReplace)


fs.writeFileSync("packages/server/src/server/routes/prompt.ts", content)
