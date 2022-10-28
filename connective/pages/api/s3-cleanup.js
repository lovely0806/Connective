import { withIronSession } from "next-iron-session";

const AWS = require("aws-sdk");
const mysql = require("mysql2");

export async function handler(req, res) {
  try {
    if (typeof req.session.get().user == "undefined") {
      return res.status(500).json({ success: false, error: "Not signed in" });
    }

    const connection = mysql.createConnection(process.env.DATABASE_URL);
    const [results, fields, err] = await connection
      .promise()
      .query(`SELECT url FROM Lists`);

    console.log(results);
    // if (req.method == "GET") {
    //   const s3 = new AWS.S3({
    //     accessKeyId: process.env.AWS_ID,
    //     secretAccessKey: process.env.AWS_SECRET,
    //     region: "us-east-1",
    //     signatureVersion: "v4",
    //   });

    //   const fileParams = {
    //     Bucket: process.env.S3_BUCKET,
    //     Prefix: "list_",
    //   };

    //   const url = await s3.getSignedUrlPromise("putObject", fileParams);
    //   let allKeys = [];
    //   function listAllKeys(marker, cb)
    //   {
    //     s3.listObjects(fileParams, function(err, data){
    //       allKeys.push(data.Contents);

    //       if(data.IsTruncated)
    //         listAllKeys(data.NextMarker, cb);
    //       else
    //         cb();
    //     });
    //   }
    //   s3.listObjectsV2(fileParams, (result) => {
    //     console.log(result);
    //     //   res.status(200).json({ success: true, result });
    //   });
    // }
    res.status(200).json({ success: true, results });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ success: false, error: e });
  }
}

export default withIronSession(handler, {
  password: process.env.APPLICATION_SECRET,
  cookieName: "Connective",
  // if your localhost is served on http:// then disable the secure flag
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
});

// export const config = {
//   api: {
//     bodyParser: {
//       sizeLimit: "4mb",
//     },
//   },
// };
