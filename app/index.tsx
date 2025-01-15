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
	ActivityIndicator,
} from "react-native";

const Home = () => {
	const [messages, setMessages] = useState<IMessage[]>([]);
	const [isGenerating, setIsGenerating] = useState<boolean>(false);
	const [prompt, setPrompt] = useState<string>("");

	const flatlistRef = useRef<FlatList | null>(null);

	const fetchApi = async (route: string, body: any) => {
		return await fetch(`http://192.168.0.8:8081/${route}`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(body),
		});
	};

	const generateImage = async () => {
		setMessages((prev) => [...prev, { role: "user", content: prompt }]);
		const result = await fetchApi("imagine", { prompt });
		const imageUrl = await result.json();
		setMessages((prev) => [...prev, { role: "image", content: imageUrl }]);
	};

	const generateCompletion = async () => {
		const result = await fetchApi("completion", [
			...messages.filter((eachMessage) => eachMessage.role !== "image"),
			{ role: "user", content: prompt },
		]);
		const jsonResponse = await result.json();
		const answer = jsonResponse.choices?.[0].message;
		setMessages((prev) => [...prev, { ...answer }]);
	};

	const onSend = async () => {
		setIsGenerating(true);
		setPrompt("");
		setMessages((prev) => [...prev, { role: "user", content: prompt }]);
		const shouldGenerateImage = await isImagePrompt();
		if (shouldGenerateImage) {
			await generateImage();
		} else {
			await generateCompletion();
		}

		setIsGenerating(false);
	};

	const isImagePrompt = async () => {
		const result = await fetchApi("completion", [
			{
				role: "system",
				content:
					"You are an AI that categories prompts into image generate requests and completion requests. You only answer with on number from 0 to 1.0 that represents how confident you are.",
			},
			{
				role: "user",
				content: `Categorize the prompt that I will give you and tell me if it is a prompt for image generation. Answer with a value from 0 to 1.0 that represents how confident you are that the prompt is for image generation.
                
            The prompt is: ${prompt}`,
			},
		]);
		const jsonResponse = await result.json();
		const answer = jsonResponse.choices?.[0].message;
		return parseFloat(answer.content) > 0.75;
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
					ListFooterComponent={() => (
						<>
							{isGenerating && (
								<>
									<Text>Generating...</Text>
									<ActivityIndicator />
								</>
							)}
						</>
					)}
				/>
				<View style={footer}>
					<TextInput
						onChangeText={setPrompt}
						style={inputStyle}
						value={prompt}
					/>
					<Button
						disabled={isGenerating}
						onPress={onSend}
						title="Send"
					/>
				</View>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
};

export default Home;
