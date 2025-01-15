import React, { FunctionComponent } from "react";
import { ViewStyle, TextStyle, View, Text, Image } from "react-native";

interface IMessageProps {
	message: IMessage;
}

export const Message: FunctionComponent<IMessageProps> = ({
	message,
}: IMessageProps) => {
	const { content, role } = message;
	const messageContainer: ViewStyle = {
		padding: 10,
		gap: 10,
		width: "80%",
		borderRadius: 10,
	};
	const messageText: TextStyle = {};
	return (
		<View
			style={[
				messageContainer,
				{
					marginLeft: role === "user" ? "auto" : 0,
					backgroundColor: role === "user" ? "#2A87FF" : "#DCE7FF",
				},
			]}
		>
			{role === "image" ? (
				<Image
					source={{ uri: content }}
					style={{ aspectRatio: 1, width: "100%" }}
				/>
			) : (
				<Text
					style={[
						messageText,
						{
							color: role === "user" ? "#fff" : "#000",
						},
					]}
				>
					{content}
				</Text>
			)}
		</View>
	);
};
