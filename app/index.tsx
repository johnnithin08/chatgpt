import { Message } from "@/components/Message";
import React, { useEffect, useRef, useState } from "react";
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
	const [messages, setMessages] = useState<IMessage[]>([]);
	const [prompt, setPrompt] = useState<string>("");

	const flatlistRef = useRef<FlatList | null>(null);
	const onSend = async () => {
		setPrompt("");
		setMessages((prev) => [...prev, { role: "user", content: prompt }]);
		const result = await fetch("http://localhost:8081/completion", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify([
				...messages,
				{ role: "user", content: prompt },
			]),
		});
		const jsonResponse = await result.json();
		const answer = jsonResponse.choices?.[0].message;
		setMessages((prev) => [...prev, { ...answer }]);
	};

	useEffect(() => {
		setTimeout(() => {
			if (flatlistRef.current) {
				flatlistRef.current.scrollToEnd({ animated: true });
			}
		}, 100);
	}, [messages]);

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
					ref={flatlistRef}
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
