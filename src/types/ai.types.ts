type ChatCompletionResponse = {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Choice[];
  usage: Usage;
  prompt_filter_results: PromptFilterResult[];
  system_fingerprint: string;
};

type Choice = {
  index: number;
  message: Message;
  finish_reason: string;
  logprobs: null;
  content_filter_results: ContentFilterResults;
};

type Message = {
  role: string;
  content: string;
};

type ContentFilterResults = {
  hate: FilterResult;
  self_harm: FilterResult;
  sexual: FilterResult;
  violence: FilterResult;
};

type FilterResult = {
  filtered: boolean;
  severity: "safe" | "low" | "medium" | "high";
};

type PromptFilterResult = {
  prompt_index: number;
  content_filter_results: ContentFilterResultsWithJailbreak;
};

type ContentFilterResultsWithJailbreak = ContentFilterResults & {
  jailbreak: JailbreakResult;
};

type JailbreakResult = {
  filtered: boolean;
  detected: boolean;
};

type Usage = {
  completion_tokens: number;
  prompt_tokens: number;
  total_tokens: number;
};

export { Message, ChatCompletionResponse };
