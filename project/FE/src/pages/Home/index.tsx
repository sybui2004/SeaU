"use client";
import { Header, Post, PostShare } from "./components";
import Sidebar from "@/components/layout/Sidebar";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTimelinePost } from "@/actions/PostAction";

const Home = React.memo(() => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: any) => state.authReducer.authData);
  const { posts, pagination, loading } = useSelector(
    (state: any) => state.postReducer
  );

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [initialLoad, setInitialLoad] = useState(true);

  const observerRef = useRef<HTMLDivElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    dispatch(getTimelinePost(user._id, 1, limit) as any);
    const timer = setTimeout(() => {
      setInitialLoad(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (posts.length > 0 && initialLoad) {
      setInitialLoad(false);
    }
  }, [posts]);

  const loadMore = useCallback(() => {
    if (!loading && pagination && page < pagination.totalPages) {
      const nextPage = page + 1;
      dispatch(getTimelinePost(user._id, nextPage, limit, true) as any);
      setPage(nextPage);
    }
  }, [dispatch, user._id, page, limit, pagination, loading]);

  const hasNextPage =
    pagination?.hasNextPage || (pagination && page < pagination.totalPages);

  useEffect(() => {
    if (!hasNextPage || loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      {
        threshold: 0.1,
        rootMargin: "200px",
      }
    );

    const currentObserverRef = observerRef.current;
    if (currentObserverRef) {
      observer.observe(currentObserverRef);
    }

    return () => {
      if (currentObserverRef) {
        observer.unobserve(currentObserverRef);
      }
    };
  }, [observerRef, loadMore, hasNextPage, loading]);

  const showLoadingSpinner = loading && (initialLoad || page === 1);
  const showLoadMoreSpinner = loading && page > 1;

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />
      <div
        ref={scrollContainerRef}
        className="grow shrink-0 basis-0 w-full pl-[80px] max-md:max-w-full h-screen overflow-y-scroll custom-scrollbar"
      >
        <Header />
        <div className="flex m-auto overflow-hidden flex-col pt-6 pb-5 max-w-[60%] w-full bg-white my-5 px-5 max-md:pl-5 max-md:max-w-full rounded-lg shadow-sm">
          <PostShare />
        </div>

        {showLoadingSpinner ? (
          <div className="flex justify-center py-10">
            <div className="animate-pulse text-gray-500">Loading...</div>
          </div>
        ) : (
          <>
            {Array.isArray(posts) && posts.length > 0 ? (
              <>
                {posts.map((post: any, index: any) => (
                  <div
                    key={post._id || index}
                    className="flex m-auto overflow-hidden flex-col pt-6 pb-10 max-w-[60%] w-full bg-white my-5 px-5 max-md:pl-5 max-md:max-w-full rounded-lg shadow-sm"
                  >
                    <Post data={post} />
                  </div>
                ))}

                {hasNextPage && (
                  <div
                    ref={observerRef}
                    className="h-16 flex justify-center items-center"
                  >
                    {showLoadMoreSpinner && (
                      <div className="animate-spin h-5 w-5 border-2 border-primary rounded-full border-t-transparent"></div>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="flex justify-center py-10">
                <div className="text-gray-500">No posts yet.</div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
});

export default Home;
