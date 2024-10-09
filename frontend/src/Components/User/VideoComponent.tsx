import React, { useEffect, useRef } from "react";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";



const VideoCall: React.FC = () => {
    const { roomId } = useParams<{ roomId: string }>();
    const containerRef = useRef<HTMLDivElement | null>(null);
    const navigate = useNavigate();
    const userData = useSelector((state:any) => state.user.user);
    const userID = userData?.userId;
    const userName = userData?.name;

    const handleLeaveRoom = async () => {
        console.log('user left the room');
        navigate('/sessions');
    };

    useEffect(() => {
        if (!containerRef.current) return ;

        const setupVideoCall = async () => {
            try {
                const APPID = Number(import.meta.env.VITE_APP_ID) || 12345;
                const SERVER_SECRET = import.meta.env.VITE_APP_SECRET ;

                if (!APPID || !SERVER_SECRET) {
                    console.error('App ID or server Secret is missing');
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
            }
        }
        setupVideoCall();

    }, [roomId, userName, userID, navigate]);

    return (
        <div className="w-full h-full" ref={containerRef} />
    )
}

export default VideoCall;