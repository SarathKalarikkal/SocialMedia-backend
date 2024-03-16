const express = require('express');
const router  = express.Router()
const User = require("../../models/user")
const Auth = require('../../libs/auth');
const Post = require('../../models/post');  
const Like = require('../../models/likes');  
const Comment = require('../../models/comment');  



router.get("/list",Auth.isLoggedIn, async(req, res)=>{

    let {page, limit}  = req.query

    if(!page){
        page = 0
    }
    if(!limit){
        limit = 5
    }


    let skip = page * limit; 
    let posts = await Post.find().skip(skip).limit(limit).populate('postedBy').lean();
    posts = await Promise.all(posts.map(async post =>{
    post.likes = await Like.count({postId: post._id})
    return post;
    }))
   return res.json({post})
})

router.post('/create', Auth.isLoggedIn, (req, res)=>{

   let {contentLink, contentType, description, postedAt} = req.body
    
   Post.create({
    contentLink, contentType, description, postedBy: req.user
}).then(() => {
    return res.json({ message: 'Post created' });
}).catch(err => {
    return res.status(500).json({ message: 'Failed to create post', error: err });
});

})

router.get('/:postId', async(req,res)=>{

    let {postId} =req.params
    let post = await Post.findById(postId)

    return res.json({post})
})


router.post('/like/:postId', Auth.isLoggedIn, async (req, res) => {
    try {
        const { postId } = req.params;
        const post = await Post.findById(postId);

        if (!post) {
            return res.status(400).json({ message: "Post doesn't exist!" });
        }

       
        const existingLike = await Like.findOne({
            postId,
            likedBy: req.user._id
        });

        if (existingLike) {
            return res.status(400).json({ message: "Already liked" });
        }

       
        const newLike = new Like({
            postId,
            likedBy: req.user._id
        });

        await newLike.save();

        return res.json({ message: "You liked" });
    } catch (error) {
        return res.status(500).json({ message: "Failed to like post", error: error });
    }
});


router.delete('/like/:postId',Auth.isLoggedIn, async(req,res)=>{
    let {postId} = req.params
    let post = await Post.findById(postId)

    if(!post){
        return res.status(400).json({message: "Post doesn't exist!"})
    }

    let isLiked = await Like.findOne({
        postId,
        likedBy : req.user
    })

   if(isLiked){
       Like.findByIdAndRemove(isLiked._id).then(()=>{
        return res.json({message : "You unliked"})
       })
   }else{
    return res.status(400).json({message: "You are not liked yet!"})
   }
    
})


router.post('/comment/:postId',Auth.isLoggedIn, async(req,res)=>{
    let {postId} = req.params
    
    let {comment} = req.body

    let post = await Post.findById(postId)

    if(!post){
        return res.status(400).json({message: "Post doesn't exist!"})
    }

    Comment.create({
        postId,
        commentedBy : req.user,
        comment
    }).then(()=>{
        return res.json({message: "You have commented"})
    })
    
})

router.get('/comment/list/:postId',Auth.isLoggedIn, async(req,res)=>{
    let {postId} = req.params
    
    let post = await Post.findById(postId)

    if(!post){
        return res.status(400).json({message: "Post doesn't exist!"})
    }

    let comments = await Comment.find({
        postId
    }).populate("commentedBy")
    
    return res.json({
        comments
    })
    
})

module.exports = router



