import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBlogs } from "../store/slices/blogSlice";
import type { AppDispatch } from "../store/store";
import type { RootState } from "../store/store";
import BlogCard from "../components/BlogCard";


const HomePage: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { blogs, loading, error } = useSelector((state: RootState) => state.blogs);

    useEffect(() => {
        dispatch(fetchBlogs());
    }, [dispatch]);

    return (
        <div className="container mx-auto py-8">
            <h1 className="text-3xl font-bold mb-8">Latest Blogs</h1>
            {loading && <p>Loading...</p>}
            {error && <p className="text-red-500">Error: {error}</p>}
            {!loading && !error && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {blogs.map((blog) => (
                        <BlogCard key={blog.id} {...blog} id={Number(blog.id)} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default HomePage;