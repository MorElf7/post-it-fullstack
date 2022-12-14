import mongoose from "mongoose";
import Comment from "./comment";
const Schema = mongoose.Schema;

const imageSchema = new Schema(
	{
		url: String,
		filename: String,
	},
	{
		toObject: { virtuals: true },
		toJSON: { virtuals: true },
	}
);

imageSchema.virtual("listThumbnail").get(function () {
	return this.url?.replace("/upload", "/upload/w_200,h_100,c_fill");
});

imageSchema.virtual("mainThumbnail").get(function () {
	return this.url?.replace("/upload", "/upload/w_350,h_250,c_fill");
});

const postSchema = new Schema(
	{
		title: String,
		description: String,
		image: imageSchema,
		user: {
			type: Schema.Types.ObjectId,
			ref: "User",
		},
		comments: [
			{
				type: Schema.Types.ObjectId,
				ref: "Comment",
			},
		],
	},
	{ timestamps: true }
);

postSchema.post("findOneAndDelete", async function (doc) {
	if (doc) {
		await Comment.deleteMany({
			_id: doc.comments,
		});
	}
});

postSchema.index({ title: "text", description: "text" });

export default mongoose.model("Post", postSchema);
