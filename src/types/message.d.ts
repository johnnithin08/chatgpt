declare interface IMessage {
	role: "system" | "user" | "assistant";
	content: string;
}
