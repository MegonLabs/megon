  export function transformRequest(input: {
    model: Provider.Model
    auth?: Auth.Api | Auth.Oauth | Auth.WellKnown | null
    messages: ModelMessage[]
    options: Record<string, any>
  }): { messages: ModelMessage[]; providerOptions: Record<string, any> } {
    const { model, auth, options } = input
    let msgs = [...input.messages]
    const opts = { ...options }

    const isOpenaiOauth = model.providerID === "openai" && auth?.type === "oauth"

    if (isOpenaiOauth) {
      const systemMessages = msgs.filter((m) => m.role === "system").map((m) => m.content)
      if (systemMessages.length > 0) {
        opts.instructions = systemMessages.join("\n")
      }
      opts.store = false
      msgs = msgs.filter((m) => m.role !== "system")
    }

    return {
      messages: msgs,
      providerOptions: providerOptions(model, opts),
    }
  }
