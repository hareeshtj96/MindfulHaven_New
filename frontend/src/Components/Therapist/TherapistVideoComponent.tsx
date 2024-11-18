import React, { useEffect, useRef } from "react";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { RootState, AppDispatch } from "../../Redux/Store/store";
import { toast } from 'react-toastify';



const TherapistVideoCall: React.FC = () => {
    const { roomId } = useParams<{ roomId: string }>();
    const containerRef = useRef<HTMLDivElement | null>(null);
    const navigate = useNavigate();
    const therapist = useSelector((state: RootState) => state.therapist.currentTherapist);

    const therapistId = therapist?.therapistId  || '';
    const therapistName = therapist?.name

    const handleLeaveRoom = async () => {
        console.log('Therapist left the room');
        navigate('/therapist/therapist_dashboard');
    };

    useEffect(() => {
        if (!containerRef.current) return ;

        const setupVideoCall = async () => {
            try {
                const APPID = Number(import.meta.env.VITE_APP_ID)
                const SERVER_SECRET = import.meta.env.VITE_APP_SECRET;

                if (!APPID || !SERVER_SECRET || !roomId || !therapistId || !therapistName) {
                    console.error('App ID or server secret is missing');
                    toast.error('Missing required information to join the session')
                    return;
                }

                const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
                    APPID,
                    SERVER_SECRET,
                    roomId || '',
                    therapistId,
                    therapistName
                );

                const zp = ZegoUIKitPrebuilt.create(kitToken);
                zp.joinRoom({
                    container: containerRef.current,
                    scenario: { mode: ZegoUIKitPrebuilt.OneONoneCall},
                    turnOnCameraWhenJoining: true,
                    turnOnMicrophoneWhenJoining: true,
                    onLeaveRoom: handleLeaveRoom,

                });
            } catch (error) {
                console.error('Error generating kit token:', error);
                toast.error('Failed to join the video session. Please try again');
            }
        };
        setupVideoCall()
    }, [roomId, therapistName, therapistId, navigate]);

    return <div className="w-screen h-screen bg-gray-900 flex items-center justify-center" ref={containerRef} />
}

export default TherapistVideoCall;