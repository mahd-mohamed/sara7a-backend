import {messageModel, userModel} from "../../DB/index.js";



export const sendMessage = async (req, res) => {

    const {receiverId} = req.params;
    const {content} = req.body;
    const {files} = req;


    const receiver = await userModel.findById(receiverId);
    if (!receiver) {
        throw new Error("Receiver not found.", { cause: 404 });
    }

    const attachments = files && files.length > 0 ? files.map((file) => file.path) : [];

    const message = await messageModel.create({
        sender: req.user?.id,
        receiver: receiverId,
        content,
        attachments,
    });

    return res.status(201).json({
        success: true,
        message,
    });    
}


export const getMessages = async (req, res) => {

    const {user} = req;

    if (!user || !user._id) {
        throw new Error("Unauthorized, user not found", { cause: 401 });
    }

    const messages = await messageModel.find({
        receiver: user._id,
    }).populate("sender", "name email profilePicture");
    
    return res.status(200).json({
        success: true,
        messages,
    });
}