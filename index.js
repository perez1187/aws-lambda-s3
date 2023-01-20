import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";


export const handler = function(event, context, callback) {
	var region = process.env.S3_REGION;
	var bucket = process.env.S3_BUCKET;
	// console.log("eveeeeeent" + JSON.stringify(event.path))

	// var region = "eu-central-1";
	// var bucket = "papu-review-static-staging";
	// var key = "index.html";
	var key = decodeURI(event.path.slice(1));

	if (key === "") {
		key = "index.html";
	}

	const s3Client = new S3Client({ region: region });

	const bucketParams = {
		Bucket: bucket,
		Key: key,
	};

	// console.log("eveeeeeent" + JSON.stringify(event))
	// var testPath = JSON.stringify(event)
	// console.log("path is " + testPath.path)

	const run = async () => {

		try {
			// Get the object} from the Amazon S3 bucket. It is returned as a ReadableStream.
			const data = await s3Client.send(new GetObjectCommand(bucketParams));

			// Convert the ReadableStream to a string.
			const file = await data.Body.transformToString("base64");
			// console.log(file)
			//console.log("dataaaa " + data.ContentType)

			var response = {
				statusCode: 200,
				headers: {
					'Content-Type': data.ContentType,
				},
				body: file,
				isBase64Encoded: true
			};
			callback(null, response);

			return 0;

		}
		catch (Error) {
			console.log("Error", Error);
			var responseErr = {
				statusCode: 404,
				headers: {
					'Content-Type': "'text/plain'",
				},
				body: "error",
				isBase64Encoded: true
			};
			callback(null, responseErr);

			return 0;
		}
	};

	run()


};
