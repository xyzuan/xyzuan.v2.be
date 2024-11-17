import { opentelemetry } from "@elysiajs/opentelemetry";
import { BatchSpanProcessor } from "@opentelemetry/sdk-trace-node";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-proto";

export default opentelemetry({
  spanProcessors: [
    new BatchSpanProcessor(
      new OTLPTraceExporter({
        url: "https://api.axiom.co/v1/traces",
        headers: {
          Authorization: `Bearer ${Bun.env.AXIOM_SECRET_TOKEN as string}`,
          "X-Axiom-Dataset": Bun.env.AXIOM_DATASET as string,
        },
      })
    ),
  ],
});
