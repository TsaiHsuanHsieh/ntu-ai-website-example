import openai from "@/services/openai";
import db from "@/services/db";

const collectionName = "image-ai"

export async function GET() {
    const imageGenList = []
    const docList = await db.collection(collectionName).orderBy("createdAt", "desc").get();
    docList.forEach(doc => {
        const imageGen = doc.data();
        imageGenList.push(imageGen)
    })
    return Response.json(imageGenList)
}

export async function POST(req) {
    const body = await req.json();
    console.log("body:", body);
    const { userInput } = body
    // TODO: 透過dall-e-3模型讓AI產生圖片
    // 文件連結: https://platform.openai.com/docs/guides/images/usage
    const prompt = `使用印象派風格畫一個:${userInput}
    不要添加額外文字,僅呈現主題`;
    const response = await openai.images.generate({
        model: "dall-e-3",
        prompt: prompt,
        n: 1,
        size: "1024x1024",
    });
    const imageURL = response.data[0].url;
    console.log("imageUrl:", imageURL);
    const imageGen = {
        imageURL,
        prompt,
        createdAt: new Date().getTime()
    };
    // 將 imageGen 存入物集合中
    await db.collection(collectionName).add(imageGen)

    return Response.json(imageGen);
}