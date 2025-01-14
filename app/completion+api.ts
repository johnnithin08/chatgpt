import OpenAI from "openai";

const openai = new OpenAI({
	apiKey: process.env.OPEN_API_KEY,
	organization: "org-6wf9iLHhlM65zUNAu2JVXGat",
	project: "proj_d7jKGBToYabWCxru9WtGt6nv",
});

export const POST = async (request: Request) => {
	const body = await request.json();
	const completion = await openai.chat.completions.create({
		model: "gpt-4o",
		messages: body,
	});

	console.log(completion.choices[0].message);
	return Response.json(completion);
};
