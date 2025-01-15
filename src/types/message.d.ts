declare interface IMessage {
	role: "system" | "user" | "assistant" | "image";
	content: string;
}
