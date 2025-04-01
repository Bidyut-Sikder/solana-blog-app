import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { useWallet } from "@solana/wallet-adapter-react";

import { useBlogContext } from "../context/BlogContext";
import { PostForm } from "../components/PostForm";

const Dashboard = () => {
  const [showModal, setShowModal] = useState(false);
  const { user, initialized, initUser, createPost, posts } =
    useBlogContext();
  const { connected, select } = useWallet();

  const navigate = useNavigate();
  const [connecting, setConnecting] = useState(false);

  const [postTitle, setPostTitle] = useState(" ");
  const [postContent, setPostContent] = useState("");

  // const connected = true;

  // const initialized = false; // Add this line to define the 'initialized' variable
  console.log(posts);
  const onConnect = () => {
    setConnecting(true);
    select("Phantom");
    setConnecting(false);
  };

  // useEffect(() => {
  //   if (user) {
  //     setConnecting(false);
  //   }
  // }, [user,publicKey]);

  return (
    <div className="dashboard background-color overflow-auto h-screen">
      <header className="fixed z-10 w-full h-14  shadow-md">
        <div className="flex justify-between items-center h-full container">
          <h2 className="text-2xl font-bold">
            <div className="bg-clip-text bg-gradient-to-br from-indigo-300 colorpink">
              Onaki
            </div>
          </h2>
          {connected ? (
            <div className="flex items-center">
              <p className=" font-bold text-sm ml-2 capitalize underlinepink">
                Home
              </p>
              <p className=" font-bold text-sm ml-2 capitalize mr-4 underlinepink">
                Blog
              </p>

              {initialized ? (
                <>
                  <img
                    src={user?.avatar}
                    alt="avatar"
                    className="w-7 rounded-full bg-gray-200 shadow ring-2 ring-indigo-400 ring-offset-2 ring-opacity-50"
                  />

                  <p className=" font-bold text-sm ml-2 capitalize">
                    {user?.name}
                  </p>
                  <Button
                    className="ml-3 mr-2"
                    onClick={() => {
                      setShowModal(true);
                    }}
                  >
                    Create Post
                  </Button>
                </>
              ) : (
                <Button
                  className="ml-3 mr-2"
                  onClick={() => {
                    initUser();
                  }}
                >
                  Initialize User
                </Button>
              )}
            </div>
          ) : (
            <Button
              loading={connecting}
              className="w-28"
              onClick={onConnect}
              leftIcon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              }
            >
              Connect
            </Button>
          )}
        </div>
      </header>
      <main className="dashboard-main pb-4 container flex relative">
        <div className="pt-3">
          {/* <h1 className="title">The Blog</h1> */}
          <div className="row">
            <article className="best-post">
              <div></div>
              <div className="best-post-content">
                <div className="best-post-content-cat">
                  December 2, 2021<span className="dot"> </span>Blog
                </div>
                <div className="best-post-content-title">
                  Lorem ipsum dolor sit amet, consectetur
                </div>
                <div className="best-post-content-sub">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                  irure dolor in reprehenderit in voluptate velit esse cillum
                  dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                  cupidatat non proident, sunt in culpa qui officia deserunt
                  mollit anim id est laborum.
                </div>
              </div>
            </article>

            <div className="all__posts">
              {posts.map((item: any) => {
                // console.log(item);
                return (
                  <article className="post__card-2r" key={item.account.id}>
               

                    <div
                      className="post__card_-2"
                      onClick={() => {
                        navigate(`/read-post/${item.publicKey.toString()}`);
                      }}
                    >
                      <div>
                        <div className="post__card_meta-2">
                          <div className="post__card_cat">
                            <span className="dot"> </span>
                            {item.account.title}{" "}
                          </div>
                          <p className="post__card_alttitle-2">
                            {item.account.content}
                          </p>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
        <div className={`modal ${showModal && "show-modal"}`}>
          <div className="modal-content">
            <span
              className="close-button text-3xl"
              onClick={() => setShowModal(false)}
            >
              ×
            </span>
            form
            <PostForm
              formHeader="Create Post"
              postTitle={postTitle}
              postContent={postContent}
              setPostTitle={setPostTitle}
              setPostContent={setPostContent}
              onSubmit={() => {
                createPost(postTitle, postContent);
                setShowModal(false);
              }}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;


