import Post from "@/models/post";
import { connectToDB } from "@/utils/database";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const GET = async (request, { params }) => {
  try {
    await connectToDB();
  } catch (error) {
    return new Response("Failed to connect", { status: 500 });
  }

  let post;
  try {
    post = await Post.findById(params.postId);
    return new Response(JSON.stringify(post), { status: 200 });
  } catch (error) {
    return new Response("Cannot find post by id", { status: 402 });
  }
};

export const PATCH = async (request, { params }) => {
  try {
    await connectToDB();
  } catch (error) {
    return new Response("Failed to connect", { status: 500 });
  }

  const { location, hashtags, description, image } = await request.json();

  let post;
  try {
    post = await Post.findById(params.postId);
  } catch (error) {
    return new Response("Cannot find post by id", { status: 402 });
  }

  const photoUrl = await cloudinary.uploader.upload(image);

  post.location = location;
  post.hashtags = hashtags;
  post.description = description;
  post.image = photoUrl.url;

  try {
    await post.save();
    return new Response("Post edited", { status: 200 });
  } catch (error) {
    return new Response("Cannot edit the post", { status: 500 });
  }
};

export const DELETE = async (request, { params }) => {
  try {
    await connectToDB();
  } catch (error) {
    return new Response("Failed to connect", { status: 500 });
  }

  try {
    await Post.findByIdAndRemove(params.postId);
    return new Response("Post deleted", { status: 200 });
  } catch (error) {
    return new Response("Cannot find post by id", { status: 402 });
  }
};