"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { faImage } from "@fortawesome/free-solid-svg-icons"
import CurrentFileIndicator from "@/components/CurrentFileIndicator";
import PageHeader from "@/components/PageHeader";
import GeneratorButton from "@/components/GenerateButton";
import ImageGenCard from "@/components/ImageGenCard";
import ImageGenPlaceholder from "@/components/ImageGenPlaceholder";

export default function ImgGen() {
    const [userInput, setUserInput] = useState("");
    // 所有生成的結果清單 [{ imageURL, prompt, createdAt }, {}, {}]
    const [imageGenList, setImageGenList] = useState([])
    // 是否在等待回應
    const [isWaiting, setIsWaiting] = useState(false);

    //當綁定的陣列式空,只有第一次render會執行
    useEffect(() => {
        axios.get("/api/image-ai")
            .then(res => {
                console.log("res:", res);
                setImageGenList(res.data)
            })
            .catch(err => {
                console.log("err:", err);
                alert("取得料失敗...")
            })
    }, [])

    function submitHandler(e) {
        e.preventDefault();
        console.log("User Input: ", userInput);
        const body = { userInput };
        console.log("body:", body);
        // 清空輸入並切換成等候狀態
        setUserInput("")
        setIsWaiting(true)
        // 將body POST到 /api/image-ai { userInput: "" }
        axios.post("/api/image-ai", body)
            .then(res => {
                console.log("res", res)
                setIsWaiting(false)
                setImageGenList([res.data, ...imageGenList])
            })
            .catch(err => {
                console.log("err", err)
                setIsWaiting(false)
            });

    }

    return (
        <>
            <CurrentFileIndicator filePath="/app/image-generator/page.js" />
            <PageHeader title="AI Image Generator" icon={faImage} />
            <section>
                <div className="container mx-auto">
                    <form onSubmit={submitHandler}>
                        <div className="flex">
                            <div className="w-4/5 px-2">
                                <input
                                    value={userInput}
                                    onChange={(e) => setUserInput(e.target.value)}
                                    type="text"
                                    className="border-2 focus:border-pink-500 w-full block p-3 rounded-lg"
                                    placeholder="Enter a word or phrase"
                                    required
                                />
                            </div>
                            <div className="w-1/5 px-2">
                                <GeneratorButton />
                            </div>
                        </div>
                    </form>
                </div>
            </section>
            <section>
                <div className="container mx-auto">
                    {/* 顯示AI輸出結果 */}

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-5 py-8">
                        {isWaiting ? <ImageGenPlaceholder /> : null}
                        {
                            imageGenList.map(imageGen => {
                                const { imageURL, prompt, createdAt } = imageGen
                                return <ImageGenCard key={createdAt} imageURL={imageURL} prompt={prompt} />
                            })
                        }
                    </div>
                </div>
            </section>
        </>
    )
}