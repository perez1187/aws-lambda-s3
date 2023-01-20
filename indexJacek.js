import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";


export const handler = async function(event, context, callback) {
	const region = process.env.S3_REGION;
	const bucket = process.env.S3_BUCKET;
	
	const s3Client = new S3Client({
		region: region
	});

	const path = decodeURI(event.path.endsWith('/') ? event.path + 'index.html' : event.path);

	let failed = false;
	const data = await s3Client.send(
		new GetObjectCommand({
			Bucket: bucket,
			Key: path.slice(1),
		})
	).catch(() => {
		failed = true;
	});

	if(failed) {
		callback(null, {
			statusCode: 404,
			headers: {
				'Content-Type': 'text/html',
			},
			body: "<h1><center>404 Not found</center></h1>",
		})
	} else {
		callback(null, {
			statusCode: 200,
			headers: {
				'Content-Type': data.ContentType,
			},
			body: await data.Body.transformToString("base64"),
			isBase64Encoded: true
		})
	}
};
