import { Button } from "./ui/button";
import { Card } from "./ui/card";


export default function Pagination({ currentPage, totalPages, onPageChange, currentPosts, setCurrentPage }) {
    const handlePageChange = () => {

    }
    
    return (
       <>
       
               <section className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 ">
          {currentPosts?.map((post) => (
            <div
              key={post.id}
              className="group relative aspect-square overflow-hidden rounded-xl bg-black"
            >
              {post.file_type === "image" ? (
                <img
                  src={post.post_url}
                  alt={post.caption || "Post"}
                  className="h-full w-full object-contain transition group-hover:scale-105"
                />
              ) : (
                <video
                  src={post.post_url}
                  className="h-full w-full object-contain transition group-hover:scale-105"
                  muted
                />
              )}

              <div className="absolute inset-0 hidden items-center justify-center bg-black/40 text-sm font-medium group-hover:flex">
                ❤️ {post.likes_count || 0} &nbsp;&nbsp; 💬{" "}
                {post.comments_count || 0}
              </div>
            </div>
          ))}

        </section>
          <div className="mt-6 flex justify-center gap-2">
  <Button
    disabled={currentPage === 1}
    onClick={() => setCurrentPage(currentPage - 1)}
  >
    Previous
  </Button>

  {Array.from({ length: totalPages }, (_, index) => {
    const pageNumber = index + 1;

    return (
      <Button
        key={pageNumber}
        onClick={() => setCurrentPage(pageNumber)}
        variant={currentPage === pageNumber ? "default" : "outline"}
      >
        {pageNumber}
      </Button>
    );
  })}

  <Button
    disabled={currentPage === totalPages}
    onClick={() => setCurrentPage(currentPage + 1)}
  >
    Next
  </Button>
</div>
        </>

      
    )
}