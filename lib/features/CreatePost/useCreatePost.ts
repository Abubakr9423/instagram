'use client';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { setPreview, resetPost } from '@/src/lib/features/CreatePost/postSlice';

export const useCreatePost = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { previewUrl, caption } = useSelector((state: any) => state.post);

   const handleFileSelect = (file: File) => {
    if (file) {
       window.originalFile = file; 
      
       const url = URL.createObjectURL(file);
      dispatch(setPreview(url));
      
       router.push('/create/obrezka');
    }
  };

   const uploadPost = async () => {
    const file = window.originalFile;
    if (!file) return alert("Файл не найден");

    const formData = new FormData();
    formData.append('Title', 'New Post');  
    formData.append('Content', caption);   
    formData.append('Images', file);        

    try {
      const response = await fetch('https://instagram-api.softclub.tj/Post/add-post', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        dispatch(resetPost());
        window.originalFile = null;
        router.push('/'); 
      }
    } catch (error) {
      console.error("Ошибка при публикации:", error);
    }
  };

  return {
    previewUrl,
    caption,
    handleFileSelect,
    uploadPost
  };
};