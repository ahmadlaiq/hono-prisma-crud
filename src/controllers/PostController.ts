//import context
import { Context } from "hono";

//import prisma client
import prisma from "../../prisma/client";

/**
 * Getting all posts with pagination
 */
export const getPosts = async (c: Context) => {
  try {
    // Get pagination parameters from the query string or set defaults
    const page = parseInt(c.req.query("page") || "1", 10);
    const perPage = parseInt(c.req.query("perpage") || "10", 10);

    // Calculate the offset and limit
    const offset = (page - 1) * perPage;
    const limit = perPage;

    // Get paginated posts
    const posts = await prisma.post.findMany({
      orderBy: { id: "desc" },
      take: Number(limit),
      skip: Number(offset),
    });

    // Get total posts
    const totalPosts = await prisma.post.count();

    // Calculate total pages
    const totalPages = Math.ceil(totalPosts / perPage);

    // Return JSON
    return c.json(
      {
        success: true,
        message: "List Data Posts!",
        total_items: totalPosts,
        total_pages: totalPages,
        current_page: page,
        data: posts,
      },
      200
    );
  } catch (e: unknown) {
    console.error(`Error getting posts: ${e}`);
    return c.json(
      {
        success: false,
        message: "Error getting posts",
      },
      500
    );
  }
};

/**
 * Creating a post
 */
export async function createPost(c: Context) {
  try {
    //get body request
    const body = await c.req.parseBody();

    //check if title and content is string
    const title = typeof body["title"] === "string" ? body["title"] : "";
    const content = typeof body["content"] === "string" ? body["content"] : "";

    //create post
    const post = await prisma.post.create({
      data: {
        title: title,
        content: content,
      },
    });

    //return JSON
    return c.json(
      {
        success: true,
        message: "Post Created Successfully!",
        data: post,
      },
      201
    );
  } catch (e: unknown) {
    console.error(`Error creating post: ${e}`);
  }
}

/**
 * Getting a post by ID
 */
export async function getPostById(c: Context) {
  try {
    // Konversi tipe id menjadi number
    const postId = parseInt(c.req.param("id"));

    //get post by id
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    //if post not found
    if (!post) {
      //return JSON
      return c.json(
        {
          success: false,
          message: "Post Not Found!",
        },
        404
      );
    }

    //return JSON
    return c.json(
      {
        success: true,
        message: `Detail Data Post By ID : ${postId}`,
        data: post,
      },
      200
    );
  } catch (e: unknown) {
    console.error(`Error finding post: ${e}`);
  }
}

/**
 * Updating a post
 */
export async function updatePost(c: Context) {
  try {
    // Konversi tipe id menjadi number
    const postId = parseInt(c.req.param("id"));

    //get body request
    const body = await c.req.parseBody();

    //check if title and content is string
    const title = typeof body["title"] === "string" ? body["title"] : "";
    const content = typeof body["content"] === "string" ? body["content"] : "";

    //update post with prisma
    const post = await prisma.post.update({
      where: { id: postId },
      data: {
        title: title,
        content: content,
        updatedAt: new Date(),
      },
    });

    //return JSON
    return c.json(
      {
        success: true,
        message: "Post Updated Successfully!",
        data: post,
      },
      200
    );
  } catch (e: unknown) {
    console.error(`Error updating post: ${e}`);
  }
}

/**
 * Deleting a post
 */
export async function deletePost(c: Context) {
  try {
    // Konversi tipe id menjadi number
    const postId = parseInt(c.req.param("id"));

    //delete post with prisma
    await prisma.post.delete({
      where: { id: postId },
    });

    //return JSON
    return c.json(
      {
        success: true,
        message: "Post Deleted Successfully!",
      },
      200
    );
  } catch (e: unknown) {
    console.error(`Error deleting post: ${e}`);
  }
}
