import { createContext, useContext } from "react";

const BlogContext = createContext({ blog: [], user: { name: "", avatar: "" } });

export const useBlogContext = () => {
  const context = useContext(BlogContext);
  if (!context) {
    throw new Error("useBlogContext must be used within a BlogContextProvider");
  }
  return context;
};

export const BlogProvider = ({ children }: any) => {
 
const user={
  name:"John Doe",
  avatar:'https://randomuser.me/api/portraits/men/85.jpg'
}

  return (
    <BlogContext.Provider value={{ blog: [], user: user }}>{children}</BlogContext.Provider>
  );
};
