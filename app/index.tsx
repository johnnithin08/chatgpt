import { Message } from "@/components/Message";
import React, { useState } from "react";
import {
	SafeAreaView,
	View,
	Text,
	ViewStyle,
	TextInput,
	Button,
	TextStyle,
	StyleProp,
	FlatList,
	KeyboardAvoidingView,
	Platform,
} from "react-native";

const Home = () => {
	const [messages, setMessages] = useState<IMessage[]>([
		{
			role: "system",
			content: "You are good",
		},
		{
			role: "assistant",
			content: "You are good",
		},
		{
			role: "user",
			content: "Hello",
		},
	]);

	const [prompt, setPrompt] = useState<string>("");
	const onSend = () => {
		setMessages((prev) => [...prev, { role: "user", content: prompt }]);
		setPrompt("");
	};
	const container: ViewStyle = {
		flex: 1,
		backgroundColor: "#fff",
	};
	const inputStyle: StyleProp<TextStyle> = {
		borderWidth: 1,
		borderColor: "gainsboro",
		padding: 10,
		borderRadius: 50,
		flex: 1,
	};
	const footer: ViewStyle = {
		marginTop: "auto",
		flexDirection: "row",
		padding: 10,
	};

	return (
		<SafeAreaView style={{ flex: 1 }}>
			<KeyboardAvoidingView
				behavior={Platform.OS === "ios" ? "padding" : "height"}
				style={{ flex: 1 }}
			>
				<FlatList
					data={messages}
					contentContainerStyle={{ gap: 10, padding: 10 }}
					renderItem={({ item, index }) => {
						return <Message message={item} />;
					}}
				/>
				<View style={footer}>
					<TextInput
						onChangeText={setPrompt}
						style={inputStyle}
						value={prompt}
					/>
					<Button onPress={onSend} title="Send" />
				</View>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
};

export default Home;
