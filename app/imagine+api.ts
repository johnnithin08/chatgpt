import OpenAI from "openai";

const openai = new OpenAI({
	apiKey: process.env.OPEN_API_KEY,
	organization: "org-6wf9iLHhlM65zUNAu2JVXGat",
	project: "proj_d7jKGBToYabWCxru9WtGt6nv",
});

export const POST = async (request: Request) => {
	const body = await request.json();
	const response = await openai.images.generate({
		model: "dall-e-3",
		prompt: body.prompt,
		n: 1,
		size: "1024x1024",
	});

	console.log(response.data[0].url);
	return Response.json(response.data[0].url);
};
