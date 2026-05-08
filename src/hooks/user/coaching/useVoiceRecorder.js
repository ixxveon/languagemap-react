import { useEffect, useRef, useState } from 'react';

// 브라우저 마이크 녹음 상태와 동작을 관리하는 Hook
export function useVoiceRecorder({ onRecorded, onError } = {}) {
    const [isRecording, setIsRecording] = useState(false);

    const mediaRecorderRef = useRef(null);
    const mediaStreamRef = useRef(null);

    useEffect(() => {
        // 컴포넌트 종료 시 사용 중인 마이크 stream 정리
        return () => {
            mediaRecorderRef.current?.stream?.getTracks().forEach((track) => track.stop());
            mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
        };
    }, []);

    // 마이크 권한 확인 후 녹음 시작
    const startRecording = async () => {
        try {
            if (!navigator.mediaDevices?.getUserMedia) {
                onError?.('현재 브라우저에서 마이크 녹음을 지원하지 않습니다.');
                return;
            }

            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaStreamRef.current = stream;

            const chunks = [];
            const recorder = new MediaRecorder(stream);

            mediaRecorderRef.current = recorder;

            // 녹음 중 생성되는 음성 데이터를 임시 저장
            recorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    chunks.push(event.data);
                }
            };

            // 녹음 종료 후 음성 파일 생성 및 외부 콜백 전달
            recorder.onstop = async () => {
                stream.getTracks().forEach((track) => track.stop());
                mediaStreamRef.current = null;
                setIsRecording(false);

                const audioBlob = new Blob(chunks, {
                    type: recorder.mimeType || 'audio/webm',
                });

                if (audioBlob.size > 0) {
                    await onRecorded?.(audioBlob);
                }
            };

            // 녹음 중 발생한 브라우저/장치 오류 처리
            recorder.onerror = () => {
                setIsRecording(false);
                onError?.('녹음 중 오류가 발생했습니다. 다시 시도해주세요.');
            };

            recorder.start();
            setIsRecording(true);
        } catch (error) {
            console.error(error);
            setIsRecording(false);

            if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
                onError?.('마이크 권한이 거부되었습니다. 브라우저 주소창 왼쪽 아이콘에서 마이크 권한을 허용해주세요.');
                return;
            }

            if (error.name === 'NotFoundError') {
                onError?.('사용 가능한 마이크 장치를 찾을 수 없습니다.');
                return;
            }

            if (error.name === 'NotReadableError') {
                onError?.('다른 프로그램이 마이크를 사용 중입니다.');
                return;
            }

            if (error.name === 'SecurityError') {
                onError?.('보안 문제로 마이크에 접근할 수 없습니다. HTTPS 또는 localhost 환경에서 실행해주세요.');
                return;
            }

            onError?.('마이크 접근 중 오류가 발생했습니다.');
        }
    };

    // 현재 녹음 중인 recorder를 안전하게 중지
    const stopRecording = () => {
        const recorder = mediaRecorderRef.current;

        if (!recorder || recorder.state === 'inactive') {
            setIsRecording(false);
            return;
        }

        recorder.stop();
    };

    // 버튼 클릭 시 녹음 시작/중지 전환
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