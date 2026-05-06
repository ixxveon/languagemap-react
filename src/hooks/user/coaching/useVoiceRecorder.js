import { useEffect, useRef, useState } from 'react';

// 음성 녹음 상태와 동작을 관리하는 Hook
export function useVoiceRecorder({ onRecorded, onError } = {}) {
    const [isRecording, setIsRecording] = useState(false);

    const mediaRecorderRef = useRef(null);
    const mediaStreamRef = useRef(null);

    useEffect(() => {
        // 컴포넌트 종료 시 마이크 stream 정리
        return () => {
            mediaRecorderRef.current?.stream?.getTracks().forEach((track) => track.stop());
            mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
        };
    }, []);

    // 녹음 시작
    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaStreamRef.current = stream;

            const chunks = [];
            const recorder = new MediaRecorder(stream);

            mediaRecorderRef.current = recorder;

            // 녹음 데이터를 임시 저장
            recorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    chunks.push(event.data);
                }
            };

            // 녹음 종료 후 audioBlob 생성 및 전달
            recorder.onstop = async () => {
                stream.getTracks().forEach((track) => track.stop());
                mediaStreamRef.current = null;

                const audioBlob = new Blob(chunks, {
                    type: recorder.mimeType || 'audio/webm',
                });

                if (audioBlob.size > 0) {
                    await onRecorded?.(audioBlob);
                }
            };

            recorder.start();
            setIsRecording(true);
        } catch {
            onError?.('마이크 권한을 확인해주세요.');
        }
    };

    // 녹음 중지
    const stopRecording = () => {
        const recorder = mediaRecorderRef.current;

        if (!recorder) return;

        setIsRecording(false);
        recorder.stop();
    };

    // 녹음 시작/중지 전환
    const toggleRecording = async () => {
        if (isRecording) {
            stopRecording();
            return;
        }

        await startRecording();
    };

    return {
        isRecording,
        startRecording,
        stopRecording,
        toggleRecording,
    };
}