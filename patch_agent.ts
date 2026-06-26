import fs from "fs"

let content = fs.readFileSync("packages/server/src/agent/agent.ts", "utf8")

const search = `          // TODO: clean this up so provider specific logic doesnt bleed over
          const authInfo = yield* auth.get(model.providerID).pipe(Effect.orDie)
          const isOpenaiOauth = model.providerID === "openai" && authInfo?.type === "oauth"

          const params = {
            experimental_telemetry: {
              isEnabled: cfg.experimental?.openTelemetry,
              metadata: {
                userId: cfg.username ?? "unknown",
              },
            },
            temperature: 0.3,
            messages: [
              ...(isOpenaiOauth
                ? []
                : system.map(
                    (item): ModelMessage => ({
                      role: "system",
                      content: item,
                    }),
                  )),
              {
                role: "user",
                content: \`Create an agent configuration based on this request: \\"\${input.description}\\".\\n\\nIMPORTANT: The following identifiers already exist and must NOT be used: \${existing.map((i) => i.name).join(", ")}\\n  Return ONLY the JSON object, no other text, do not wrap in backticks\`,
              },
            ],
            model: language,
            schema: z.object({
              identifier: z.string(),
              whenToUse: z.string(),
              systemPrompt: z.string(),
            }),
          } satisfies Parameters<typeof generateObject>[0]

          if (isOpenaiOauth) {
            return yield* Effect.promise(async () => {
              const result = streamObject({
                ...params,
                providerOptions: ProviderTransform.providerOptions(resolved, {
                  instructions: system.join("\\n"),
                  store: false,
                }),
                onError: () => {},
              })
              for await (const part of result.fullStream) {
                if (part.type === "error") throw part.error
              }
              return result.object
            })
          }

          return yield* Effect.promise(() => generateObject(params).then((r) => r.object))`

const replace = `          const authInfo = yield* auth.get(model.providerID).pipe(Effect.orDie)

          const rawMessages: ModelMessage[] = [
            ...system.map((item): ModelMessage => ({ role: "system", content: item })),
            {
              role: "user",
              content: \`Create an agent configuration based on this request: \\"\${input.description}\\".\\n\\nIMPORTANT: The following identifiers already exist and must NOT be used: \${existing.map((i) => i.name).join(", ")}\\n  Return ONLY the JSON object, no other text, do not wrap in backticks\`,
            },
          ]

          const { messages, providerOptions } = ProviderTransform.transformRequest({
            model: resolved,
            auth: authInfo,
            messages: rawMessages,
            options: {},
          })

          const params = {
            experimental_telemetry: {
              isEnabled: cfg.experimental?.openTelemetry,
              metadata: {
                userId: cfg.username ?? "unknown",
              },
            },
            temperature: 0.3,
            messages,
            providerOptions,
            model: language,
            schema: z.object({
              identifier: z.string(),
              whenToUse: z.string(),
              systemPrompt: z.string(),
            }),
          } satisfies Parameters<typeof generateObject>[0]

          return yield* Effect.promise(async () => {
            const result = streamObject({
              ...params,
              onError: () => {},
            })
            for await (const part of result.fullStream) {
              if (part.type === "error") throw part.error
            }
            return result.object
          })`

content = content.replace(search, replace)
fs.writeFileSync("packages/server/src/agent/agent.ts", content)
