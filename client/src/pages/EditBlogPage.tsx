import React, { useState, useEffect} from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchBlogById, updateBlog } from "../store/slices/blogSlice";
import type { AppDispatch, RootState } from "../store/store";

const EditBlogPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { currentBlog, loading: fetchLoading } = useSelector(
    (state: RootState) => state.blogs,
  );

  // 1. Initialize state with a fallback.
  // We use the currentBlog values ONLY if they exist already.
  const [formData, setFormData] = useState({
    title: currentBlog?.title || "",
    content: currentBlog?.content || "",
    image: currentBlog?.image || "",
  });

  // 2. Fetch the data if it's not in the store
  useEffect(() => {
    if (id) dispatch(fetchBlogById(id));
  }, [id, dispatch]);

  // 3. FIXED: Avoid the cascading render warning.
  // Instead of an effect that calls setState, we can use a "Reset" approach.
  // Or, more simply, we check if the ID has changed or if the data finally arrived.
  const [prevId, setPrevId] = useState(id);

  if (id !== prevId) {
    setPrevId(id);
    setFormData({
      title: currentBlog?.title || "",
      content: currentBlog?.content || "",
      image: currentBlog?.image || "",
    });
  }

  // Handle the "Initial Load" once the currentBlog arrives from the API
  const [hasInitialized, setHasInitialized] = useState(false);
  if (currentBlog && !hasInitialized) {
    setHasInitialized(true);
    setFormData({
      title: currentBlog.title,
      content: currentBlog.content,
      image: currentBlog.image || "",
    });
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (id) {
      await dispatch(updateBlog({ blogId: id, blogData: formData }));
      navigate(`/blogs/${id}`);
    }
  };

  if (fetchLoading && !hasInitialized)
    return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      {/* Form JSX remains the same as before */}
      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white p-8 rounded-xl shadow-sm border"
      >
        <input
          className="w-full text-3xl font-bold border-b outline-none focus:border-blue-500"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
        <textarea
          className="w-full min-h-[300px] text-lg outline-none"
          value={formData.content}
          onChange={(e) =>
            setFormData({ ...formData, content: e.target.value })
          }
        />
        <button className="bg-blue-600 text-white px-8 py-3 rounded-lg">
          Update
        </button>
      </form>
    </div>
  );
};

export default EditBlogPage;
