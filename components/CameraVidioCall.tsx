"use client"

import { useEffect, useRef } from "react"

export default function Camera() {
    const videoRef = useRef<HTMLVideoElement>(null)

    useEffect(() => {
        let stream: MediaStream | null = null;

        async function startCamera() {
            try {
                stream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: false,
                })

                if (videoRef.current) {
                    videoRef.current.srcObject = stream
                }
            } catch (err) {
                console.error("Хатогӣ ҳангоми пайваст шудан ба камера:", err)
            }
        }

        startCamera()

        // Cleanup: Вақте корбар аз саҳифа меравад, камераро хомӯш мекунад
        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop())
            }
        }
    }, [])

    return (
        <video
            ref={videoRef}
            autoPlay
            playsInline
            muted 
            className="w-100 h-64 rounded-t-xl bg-black object-cover"
        />
    )
}