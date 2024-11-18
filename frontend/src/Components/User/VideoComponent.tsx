import React, { useEffect, useRef } from "react";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from 'react-toastify';



const VideoCall: React.FC = () => {
    const { roomId } = useParams<{ roomId: string }>();
    const containerRef = useRef<HTMLDivElement | null>(null);
    const navigate = useNavigate();
    const userData = useSelector((state:any) => state.user.user);
    const userID = userData?.userId;
    const userName = userData?.name;

    const handleLeaveRoom = async () => {
        console.log('user left the room');
        navigate('/issue_management');
    };

    useEffect(() => {
        if (!containerRef.current) return ;

        const setupVideoCall = async () => {
            try {
                const APPID = Number(import.meta.env.VITE_APP_ID) || 12345;
                const SERVER_SECRET = import.meta.env.VITE_APP_SECRET ;

                if (!APPID || !SERVER_SECRET || !roomId || !userID || !userName) {
                    console.error('App ID or server Secret is missing');
                    toast.error('Missing required information to join the session')
                    return 
                }
                const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
                    APPID,
                    SERVER_SECRET,
                    roomId || '',
                    userID,
                    userName
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
                toast.error('Failed to join the video session. Please try again')
            }
        }
        setupVideoCall();

    }, [roomId, userName, userID, navigate]);

    return (
        <div className="w-screen h-screen bg-gray-900 flex items-center justify-center" ref={containerRef} />
    )
}

export default VideoCall;