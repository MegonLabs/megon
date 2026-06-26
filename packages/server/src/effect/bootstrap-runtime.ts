import { Layer, ManagedRuntime } from "effect"
import { Format } from "@/format"
import { ShareNext } from "@/share/share-next"

export const BootstrapLayer = Layer.mergeAll(Format.defaultLayer, ShareNext.defaultLayer)

export const BootstrapRuntime = ManagedRuntime.make(BootstrapLayer)
