/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import axios from "axios";
import validator from "validator";
import { io, Socket } from "socket.io-client";
import { v4 as uuidv4 } from "uuid";

import Navbar from "../../components/navbar";
import { motion } from "framer-motion";
import Head from "next/head";

import styles from "../../styles/chat/index.module.scss";
import { getLangFile, copyToClipboard } from "../../helpers/pages";

import type { NextPage, GetServerSideProps } from "next";
import type { PrivateMessage, User } from "../../../shared/types/models";
import type LangPack from "../../../shared/types/lang";

export const getServerSideProps: GetServerSideProps = async (context: any) => {
    if (!context.req.isAuthenticated())
        return {
            redirect: {
                destination: "/login",
                permanent: false,
            },
        };

    return {
        props: {
            host: process.env.HOST,
            lang: getLangFile(context.req.headers["accept-language"], "main", "home"),

            user: JSON.parse(JSON.stringify(context.req.user)),
            sessionID: context.req.sessionID,

            cdnURI: process.env.CDN_URI,
            chatServiceURI: process.env.CHAT_SERVICE_URI,
        },
    };
};

interface PageProps {
    host: string;
    lang: typeof LangPack.accounts.login;

    user: User;
    sessionID: string;

    cdnURI: string;
    chatServiceURI: string;
}

const Chat: NextPage<PageProps> = (props: PageProps): JSX.Element => {
    const [contactList, setContactList] = React.useState([]);

    const [openChat, setOpenChat] = React.useState({} as User);
    const [chatMessages, setChatMessages] = React.useState([] as Array<PrivateMessage>);

    const [isLoadingOlderMessages, setIsLoadingOlderMessages] = React.useState(false);
    const [chatInfo, setChatInfo] = React.useState({
        messagePacksLoaded: 0,
        wasStartOfChatReached: false,
    });

    const [socket, setSocket] = React.useState(null as unknown as Socket);

    const switchChat = (user: User): void => {
        if (!socket || !socket.connected) return;

        socket.emit("join private chat room", {
            userID: props.user.userID,
            connectToID: user.userID,
        });

        setOpenChat(user);
        setChatMessages([]);

        setChatInfo({ messagePacksLoaded: 0, wasStartOfChatReached: false });
        setIsLoadingOlderMessages(true);
    };

    const sendMessage = () => {
        if (!socket || !socket.connected) return;
        const messageInput = document.querySelector("#message-input") as HTMLTextAreaElement;
        if (validator.isEmpty(messageInput.value, { ignore_whitespace: true })) return;

        messageInput.style.height = "50px";

        const messageID = `${[props.user.userID, openChat.userID].sort().join("")}_${uuidv4().split("-").join("").substring(0, 16)}`;

        socket.emit("private message", {
            author: props.user.username,

            authorID: props.user.userID,
            recipientID: openChat.userID,

            messageID: messageID,

            // attachments
            // embeds
            // mentions
            content: messageInput.value,

            createdAt: Date.now(),
        });

        messageInput.value = "";
        messageInput.focus();
    };

    React.useEffect(() => {
        document.addEventListener("keydown", (event: any) => {
            if (event.key == "Escape") return setOpenChat({} as User);
        });

        const newSocket = io(props.chatServiceURI, {
            auth: { sessionID: props.sessionID, username: props.user.username },
        });
        newSocket.on("connect", () => {
            console.log("Socket connected");
        });

        newSocket.on("disconnect", () => {
            console.log("Disconnected");
        });

        setSocket(newSocket);

        newSocket.on("private message", (data: PrivateMessage) => {
            setChatMessages((state: any) => {
                return [...state, data];
            });

            setTimeout(() => {
                const chatBottom = document.querySelector("#chat-bottom") as HTMLDivElement;
                chatBottom.scrollIntoView({ block: "end" });
            }, 100);
        });

        // Load contacts
        (async () => {
            const contactsResponse = await axios({
                method: "post",
                url: `${props.host}/api/users/get-contacts`,
                data: {
                    auth: {
                        sessionID: props.sessionID,
                        username: props.user.username,
                    },
                    data: {
                        chatID: [props.user.userID, openChat.userID].sort().join(""),
                        chatSkipIndex: chatInfo.messagePacksLoaded,
                    },
                },
            });

            setContactList(contactsResponse.data);
        })();
    }, []);

    React.useEffect(() => {
        if (isLoadingOlderMessages == true && chatInfo.wasStartOfChatReached == false) {
            (async () => {
                const messagesResponse = await axios({
                    method: "post",
                    url: `${props.chatServiceURI}/api/messages/get-messages`,
                    data: {
                        auth: {
                            sessionID: props.sessionID,
                            username: props.user.username,
                        },
                        data: {
                            chatID: [props.user.userID, openChat.userID].sort().join(""),
                            chatSkipIndex: chatInfo.messagePacksLoaded,
                        },
                    },
                });

                if (messagesResponse.data.length !== 50) {
                    setChatInfo((prevState) => {
                        return { ...prevState, wasStartOfChatReached: true };
                    });
                }

                const isOpeningChat = chatMessages.length == 0;

                setChatMessages((prevState) => {
                    return [...messagesResponse.data.sort().reverse(), ...prevState];
                });

                setChatInfo((prevState) => {
                    return { ...prevState, messagePacksLoaded: prevState.messagePacksLoaded + 1 };
                });

                if (isOpeningChat) {
                    setTimeout(() => {
                        const chatBottom = document.querySelector("#chat-bottom") as HTMLDivElement;
                        chatBottom.scrollIntoView({ block: "end" });
                    }, 100);
                } else {
                    setTimeout(() => {
                        // So it doesn't go right into the last message of the new messages
                        const message = document.querySelector(`#message-${chatMessages[0].messageID}`) as HTMLDivElement;
                        message.scrollIntoView({ block: "start" });
                    }, 100);
                }

                setIsLoadingOlderMessages(false);
            })();
        }
    }, [isLoadingOlderMessages]);

    return (
        <div className={styles["page"]}>
            <Head>
                <title>{props.lang.pageTitle}</title>
                <meta name="title" content={props.lang.pageTitle} />
                <meta name="description" content={props.lang.pageDescription} />
            </Head>

            <Navbar lang={props.lang} user={props.user} cdnURI={props.cdnURI} />

            {/* Divide the page in two */}
            <main>
                <div className={styles["contacts"]}>
                    <div>
                        <input type="text" placeholder="Search or start a new chat" className={styles["contact-search-bar"]} />

                        {contactList.map((user: User) => {
                            return (
                                <motion.div
                                    className={styles["contact"]}
                                    variants={{
                                        open: {
                                            backgroundColor: "#2b2b2b",
                                        },
                                        closed: {
                                            backgroundColor: "#1f1f1f",
                                        },
                                    }}
                                    animate={openChat.userID == user.userID ? "open" : "closed"}
                                    transition={{
                                        duration: 0.1,
                                    }}
                                    key={user.userID}
                                    onClick={() => {
                                        if (user.userID == openChat.userID) return;
                                        switchChat(user);
                                    }}
                                >
                                    <img
                                        src={`${props.cdnURI}/avatars/${user.userID}/${user.avatar}.png?q=1`}
                                        className={styles["avatar"]}
                                        alt={`${user.username} avatar`}
                                    />

                                    <div className={styles["contact-information"]}>
                                        <h5>{user.displayName}</h5>
                                        {/* <span title={chatMessages[chatMessages.length - 1].content}>
                                            {chatMessages[chatMessages.length - 1].content.substring(0, 32)}
                                            {chatMessages[chatMessages.length - 1].content.substring(0, 32) ==
                                                chatMessages[chatMessages.length - 1].content && "..."}
                                        </span> */}
                                        {/* Here will be the last message sent inside a span */}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                {openChat.userID !== undefined && (
                    <div className={styles["chat"]}>
                        <div>
                            <div className={styles["navbar"]}>
                                <img
                                    src={`${props.cdnURI}/avatars/${openChat.userID}/${openChat.avatar}.png?q=50`}
                                    className={styles["avatar"]}
                                    alt={`${openChat.username} avatar`}
                                />

                                <div className={styles["contact-information"]}>
                                    <h5>{openChat.displayName}</h5>
                                    <h5>{openChat.username}</h5>
                                </div>
                            </div>

                            <div
                                className={styles["messages"]}
                                onScroll={() => {
                                    if (isLoadingOlderMessages == true) return;
                                    const chatTopRect = (document.querySelector("#chat-top") as HTMLDivElement).getBoundingClientRect();

                                    if (chatTopRect.bottom > 0 && chatInfo.wasStartOfChatReached == false) {
                                        setIsLoadingOlderMessages(true);
                                    }
                                }}
                            >
                                <div id="chat-top" className={styles["chat-top"]}>
                                    {chatInfo.wasStartOfChatReached == false && <div>Loading messages...</div>}
                                    {chatInfo.wasStartOfChatReached == true && <div>This is the start of your chat</div>}
                                </div>

                                {chatMessages.map((message: PrivateMessage) => {
                                    return (
                                        <motion.div key={message.messageID} className={styles["message"]} id={`message-${message.messageID}`}>
                                            {message.authorID == props.user.userID && (
                                                <div className={styles["message-menu-sent"]}>
                                                    <button>
                                                        <img src="/assets/svg/menu-icon.svg" alt="menu-icon" />

                                                        <div>
                                                            <button>Reply</button>
                                                            <br />
                                                            <button
                                                                onClick={() => {
                                                                    copyToClipboard(window, document, message.messageID);

                                                                    alert("Copied to clipboard");
                                                                }}
                                                            >
                                                                Copy message ID
                                                            </button>
                                                            <br />
                                                            <button>Delete</button>
                                                        </div>
                                                    </button>
                                                </div>
                                            )}

                                            <div className={message.authorID == props.user.userID ? styles["sent-by-user"] : styles["sent-to-user"]}>
                                                {message.content}
                                                <br />
                                                <div title={new Date(message.createdAt).toLocaleString()} className={styles["timestamp"]}>
                                                    {new Date(message.createdAt).toLocaleTimeString()}
                                                </div>
                                            </div>

                                            {message.authorID !== props.user.userID && (
                                                <div className={styles["message-menu-received"]}>
                                                    <button>
                                                        <img src="/assets/svg/menu-icon.svg" alt="menu-icon" />

                                                        <div>
                                                            <button>Reply</button>
                                                            <br />
                                                            <button
                                                                onClick={() => {
                                                                    copyToClipboard(window, document, message.messageID);

                                                                    alert("Copied to clipboard");
                                                                }}
                                                            >
                                                                Copy message ID
                                                            </button>
                                                        </div>
                                                    </button>
                                                </div>
                                            )}
                                        </motion.div>
                                    );
                                })}

                                <div id="chat-bottom"></div>
                            </div>

                            <div className={styles["message-input"]}>
                                <button onClick={sendMessage}>
                                    <img src="/assets/svg/add-attachment-icon.svg" alt="add-attachment-icon" />
                                </button>
                                <textarea
                                    onKeyDown={(event: any) => {
                                        if (event.target.value.length > 2000) {
                                            event.target.value = event.target.value.substring(0, 2000);
                                            return event.preventDefault();
                                        }

                                        if (event.key == "Enter") {
                                            if (!openChat.userID || event.shiftKey) return;
                                            event.preventDefault();
                                            sendMessage();
                                        }
                                    }}
                                    id="message-input"
                                    placeholder="Message..."
                                    onInput={(event: any) => {
                                        if (event.target.scrollHeight > 70) return;
                                        event.target.style.height = 60;
                                        event.target.style.height = event.target.scrollHeight + "px";
                                    }}
                                />
                                <button onClick={sendMessage}>
                                    <img src="/assets/svg/send-message-icon.svg" alt="send-message-icon" />
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                {openChat.userID == undefined && (
                    <div className={styles["chat"]}>
                        <h1>No chat open</h1>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Chat;
