import { Link } from "react-router-dom";

interface BlogCardProps {
    id: number;
    title: string;
    content: string;
    image?: string;
    author:{ username: string };
    createdAt: string;
}

const BlogCard: React.FC<BlogCardProps> = ({ id, title, content, image, author, createdAt }) => {
    return (
        <div className="border rounded-lg  overflow-hidden shadow-lg p-4">
            {image && <img src={image} alt={title} className="w-full h-48 object-cover mb-4" />}
            <h2 className="text-xl font-bold mb-2">{title}</h2>
            <p className="text-gray-600 text-sm mb-4">By {author.username} on {new Date(createdAt).toLocaleDateString()}</p>
            <p className="text-gray-800 mb-4">{content.length > 100 ? content.substring(0, 100) + "..." : content}</p>
            <Link to={`/blogs/${id}`} className="text-blue-500 hover:underline">Read More</Link>
        </div>
    );
};

export default  BlogCard