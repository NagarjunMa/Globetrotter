import React, { useRef, useState } from 'react';
import { FaShareAlt, FaWhatsapp, FaCopy, FaCheck } from 'react-icons/fa';
import { WhatsappShareButton } from 'react-share';
import html2canvas from 'html2canvas';

const ChallengeShare = ({ challengeData, onClose }) => {
    const [imageGenerated, setImageGenerated] = useState(false);
    const [copied, setCopied] = useState(false);
    const challengeCardRef = useRef(null);
    const [imageUrl, setImageUrl] = useState(null);

    const { challengeLink, username, stats } = challengeData;

    const generateImage = async () => {
        if (challengeCardRef.current) {
            try {
                const canvas = await html2canvas(challengeCardRef.current);
                const dataUrl = canvas.toDataURL('image/png');
                setImageUrl(dataUrl);
                setImageGenerated(true);
            } catch (error) {
                console.error('Error generating image:', error);
            }
        }
    };

    const copyLink = () => {
        navigator.clipboard.writeText(challengeLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
                <div className="bg-gradient-to-r from-blue-600 to-blue-400 px-6 py-4 rounded-t-xl">
                    <div className="flex justify-between items-center">
                        <h2 className="text-white text-xl font-bold">Challenge a Friend</h2>
                        <button
                            onClick={onClose}
                            className="text-white hover:text-gray-200"
                        >
                            &times;
                        </button>
                    </div>
                </div>

                <div className="p-6">
                    <div
                        ref={challengeCardRef}
                        className="bg-blue-50 p-4 rounded-lg mb-6"
                    >
                        <h3 className="font-bold text-lg text-center mb-2">
                            {username} challenges you to beat their score!
                        </h3>
                        <div className="bg-white rounded-lg p-3 text-center">
                            <p className="text-gray-500 mb-1">Current score</p>
                            <div className="text-2xl font-bold text-blue-600">{stats.score}</div>
                            <div className="flex justify-center mt-2 text-sm">
                                <div className="mr-4">
                                    <span className="text-green-500 font-medium">{stats.correctAnswers}</span> correct
                                </div>
                                <div>
                                    <span className="text-red-500 font-medium">{stats.incorrectAnswers}</span> wrong
                                </div>
                            </div>
                        </div>
                    </div>

                    {!imageGenerated && (
                        <button
                            onClick={generateImage}
                            className="btn btn-primary w-full mb-4"
                        >
                            <FaShareAlt className="mr-2" />
                            Generate Share Image
                        </button>
                    )}

                    {imageGenerated && (
                        <>
                            <div className="mb-4">
                                <img
                                    src={imageUrl}
                                    alt="Challenge Card"
                                    className="w-full rounded-lg border"
                                />
                            </div>

                            <div className="flex mb-4">
                                <WhatsappShareButton
                                    url={challengeLink}
                                    title={`${username} challenges you to beat their Globetrotter score of ${stats.score}! Can you top it?`}
                                    className="flex-1 mr-2"
                                >
                                    <button className="btn bg-green-500 hover:bg-green-600 text-white w-full flex items-center justify-center">
                                        <FaWhatsapp className="mr-2" />
                                        Share on WhatsApp
                                    </button>
                                </WhatsappShareButton>

                                <button
                                    onClick={copyLink}
                                    className="btn btn-outline flex-1 ml-2 flex items-center justify-center"
                                >
                                    {copied ? <FaCheck className="mr-2" /> : <FaCopy className="mr-2" />}
                                    {copied ? 'Copied!' : 'Copy Link'}
                                </button>
                            </div>
                        </>
                    )}

                    <div className="text-sm text-gray-500 text-center">
                        Share this challenge with your friends and see who can get the highest score!
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChallengeShare;