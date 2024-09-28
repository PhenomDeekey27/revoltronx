import axios from "axios";
import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const Sample = () => {
  const [SearchTerm, setSearchTerm] = useState("");
  const [articles, setArticles] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [videos, setVideos] = useState([]);

  const [Onsearch, setOnsearch] = useState(false)
 
  // State to hold original articles, blogs, and videos
  const [originalArticles, setOriginalArticles] = useState([]);
  const [originalBlogs, setOriginalBlogs] = useState([]);
  const [originalVideos, setOriginalVideos] = useState([]);

  const callFunc = async (SearchTerm) => {
    await getAllArticles(SearchTerm);
    await getAllBlogs(SearchTerm);
    await getAllVideos(SearchTerm);
    setOnsearch(true)
  };

  const getAllArticles = async (SearchTerm) => {
    try {
  
      const url = `https://www.googleapis.com/customsearch/v1`;
      const params = {
        q: `${SearchTerm} + articles`,
        cx: import.meta.env.VITE_SEARCHID,
        key: import.meta.env.VITE_API_KEY,
        num: 10,
        siteSearch: "medium.com",
      };
      const response = await axios.get(url, { params });
      

      
      setArticles(formatArticles(response?.data?.items))
      
      setOriginalArticles(response?.data?.items);
     // Save the original articles
     
        toast.success("Articles fetched Successfully");
      
    } catch (error) {
      
      toast.error(error);
    }
  };

  const getAllBlogs = async (SearchTerm) => {
    try {
      const url = `https://www.googleapis.com/customsearch/v1`;
      const params = {
        q: `${SearchTerm} + blogs`,
        cx: import.meta.env.VITE_SEARCHID,
        key: import.meta.env.VITE_API_KEY,
        num: 10,
        siteSearch: "medium.com",
      };
      const response = await axios.get(url, { params });
   
      setBlogs(formatBlogs(response.data?.items)); // Set formatted blogs
      setOriginalBlogs(formatBlogs(response.data?.items));
      toast.success("Blogs Fetched successfully") // Save the original blogs
    } catch (error) {
     
      toast.error(error);
    }
  };

  const getAllVideos = async (SearchTerm) => {
    try {
      const response = await axios.get(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=${SearchTerm}&type=video&key=${import.meta.env.VITE_API_KEY}`
      );
  
      const formattedVideos = formatVideos(response.data?.items);
      setVideos(formattedVideos);
      setOriginalVideos(formattedVideos);
      toast.success("Youtube Videos Fetched successfully") 
      
    } catch (error) {
      toast.error(error)
      
    }
  // Save the original videos
  
  };

  const formatArticles = (items) => {
   

   
    return items.map(item => ({
        
      title: item.title,
      url: item.link,
      snippet: item.snippet,
      date: item.htmlSnippet?.split("<b>")[0], // Extract the date
      img: item.pagemap?.cse_image?.[0]?.src || "default-image-url.jpg",
    }
    )
)
      
  };

  const formatBlogs = (items) => {
    return items.map(item => ({
      title: item.title,
      url: item.link,
      snippet: item.snippet,
      date: item.htmlSnippet.split("<b>")[0], // Extract the date
      img: item.pagemap?.cse_image?.[0]?.src || "default-image-url.jpg",
    }));
  };

  const formatVideos = (items) => {
    return items.map(item => ({
      url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
      img: item.snippet.thumbnails.medium.url,
      title: item.snippet.title,
      desc: item.snippet.description,
      date: item.snippet.publishedAt.split("T")[0],
    }));
  };

  const sortByDate = (items, setItems, originalItems, order = 'asc') => {
    console.log(items,"items")
   
    const sortedItems = [...items].sort((a, b) => {
        
    
      const dateA = new Date(a.date);
      console.log(dateA , dateA)
      const dateB = new Date(b.date);
      return order === 'asc' ? dateA - dateB : dateB - dateA;
    });
    console.log('sorted',sortedItems)
    setItems(sortedItems); // Update state with sorted array
  };


  const resetItems = (setItems, originalItems) => {
    setItems(originalItems); // Reset to original state
  };

  return (
    <div>
    <Toaster></Toaster>
    
      <div className="flex items-center justify-center gap-4 mt-6">
        <input
          type="text"
          placeholder="Enter Keywords here"
          value={SearchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border-gray-300 border-2 p-1 rounded-lg placeholder:text-black"
        />
        <button
          className="bg-red-600 p-2 rounded-lg text-white"
          onClick={() => callFunc(SearchTerm)}
        >
          Search
        </button>
      </div>

      {/* Articles */}
      <div>
        {
          Onsearch && <>
            <h1 className="text-4xl text-center text-orange-500 font-extrabold">Articles</h1>
        <div className="flex md:flex-row flex-col gap-2 justify-between p-4">
          <button onClick={() => sortByDate(articles, setArticles, originalArticles, 'asc')} className="bg-yellow-300 font-bold p-2 rounded-lg uppercase">Sort Articles Asc</button>
          <button onClick={() => sortByDate(articles, setArticles, originalArticles, 'desc')} className="bg-yellow-300 font-bold p-2 rounded-lg uppercase">Sort Articles Desc</button>
          <button onClick={() => resetItems(setArticles, originalArticles)} className="bg-gray-300 font-bold p-2 rounded-lg uppercase">Reset Articles</button>
        </div>

          </>
        }
       
      
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 p-2">
          {articles.map((item, index) => {
          
            return (
              <a href={item.url} target="_blank" rel="noopener noreferrer" className="block w-full" key={index} data-aos="fade-left">
                <div className="bg-slate-300 p-4 flex flex-col items-center justify-between rounded-md shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out max-w-[350px] h-[500px] mx-auto">
                  {/* Image */}
                  <div className="w-full h-[300px] flex items-center justify-center overflow-hidden rounded-md">
                    <img
                      src={item?.img}
                      alt="Article Image"
                      className="object-cover w-full h-full"
                    />
                  </div>

                  {/* Title */}
                  <h1 className="text-2xl p-1 text-blue-800 font-semibold text-center mt-2 mb-2">
                    {item.title}
                  </h1>

                  {/* Description */}
                  <div className="p-2 flex-1 flex flex-col justify-between text-center">
                    <p className="text-sm">by <span className="ml-1 italic text-green-600">{item.author}</span></p>
                    <p className="text-base line-clamp-4 mt-2">{item.snippet}</p>

                    {/* Read more link */}
                    <p className="text-blue-700 font-semibold mt-4">Click here to read more...</p>
                  </div>

                  {/* Published Date */}
                  <div className="w-full text-right">
                    <h2 className="text-red-600 text-sm">{item.date}</h2>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
       
      </div>

      {/* Blogs */}
      <div>
        {
          Onsearch && <>
            <h1 className="text-3xl text-center font-bold">Blogs</h1>
        <div className="flex md:flex-row flex-col gap-2 justify-between p-4">
          <button onClick={() => sortByDate(blogs, setBlogs, originalBlogs, 'asc')} className="bg-yellow-300 font-bold p-2 rounded-lg uppercase">Sort Blogs Asc</button>
          <button onClick={() => sortByDate(blogs, setBlogs, originalBlogs, 'desc')} className="bg-yellow-300 font-bold p-2 rounded-lg uppercase">Sort Blogs Desc</button>
          <button onClick={() => resetItems(setBlogs, originalBlogs)} className="bg-gray-300 font-bold p-2 rounded-lg uppercase">Reset Blogs</button>
        </div>

          </>
        }
      
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 p-2">
          {blogs.map((blog, index) => {
            return (
              <a href={blog.url} target="_blank" rel="noopener noreferrer" className="block w-full" key={index} data-aos="fade-left">
                <div className="bg-slate-300 p-4 flex flex-col items-center mx-auto  justify-between rounded-md shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out max-w-[350px] h-[450px]">
                  {/* Image Container */}
                  <div className="flex items-center justify-center h-[250px] w-full overflow-hidden">
                    <img
                      src={blog.img}
                      alt="Blog Thumbnail"
                      className="object-cover max-h-[250px] max-w-full w-full"
                    />
                  </div>

                  {/* Title */}
                  <h1 className="font-bold text-blue-800 italic text-xl text-center mt-2">{blog.title}</h1>

                  {/* Snippet */}
                  <div className="flex-1 mt-2">
                    <p className="line-clamp-2 text-center">{blog.snippet}</p>
                  </div>

                  {/* Read More Link */}
                  <div className="w-full text-right">
                    <h2 className="text-red-600 font-semibold">{blog.date}</h2>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
       
      </div>

      {/* Videos */}
      <div>
        {
          Onsearch && <>
             <h1 className="text-2xl text-center font-bold">Videos</h1>
        <div className="flex md:flex-row flex-col gap-2 justify-between p-4">
          <button onClick={() => sortByDate(videos, setVideos, originalVideos, 'asc')} className="bg-yellow-300 font-bold p-2 rounded-lg uppercase">Sort Videos Asc</button>
          <button onClick={() => sortByDate(videos, setVideos, originalVideos, 'desc')} className="bg-yellow-300 font-bold p-2 rounded-lg uppercase">Sort Videos Desc</button>
          <button onClick={() => resetItems(setVideos, originalVideos)} className="bg-gray-300 font-bold p-2 rounded-lg uppercase">Reset Videos</button>
        </div>
          </>
        }
     
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 p-2">
          {videos.map((video, index) => {
            return (
              <a href={video.url} target="_blank" rel="noopener noreferrer" className="block w-full" key={index} data-aos="fade-up">
                <div className="bg-slate-300 p-4 flex flex-col mx-auto items-center justify-between rounded-md shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out max-w-[350px] h-[500px]">
                  {/* Image Container */}
                  <div className="flex items-center justify-center h-[200px] w-full overflow-hidden">
                    <img
                      src={video.img}
                      alt="Video Thumbnail"
                      className="object-cover max-h-full max-w-full w-full"
                    />
                  </div>

                  {/* Title */}
                  <h1 className="font-bold text-blue-800 text-lg mt-2 text-center">{video.title}</h1>

                  {/* Description */}
                  <div className="flex-1 mt-2">
                    <p className="line-clamp-2 text-center">{video.desc}</p>
                  </div>

                  {/* Published Date */}
                  <div className="w-full text-right">
                    <h2 className="text-red-600 text-sm">{video.date}</h2>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      
      </div>
    </div>
  );
};

export default Sample;
