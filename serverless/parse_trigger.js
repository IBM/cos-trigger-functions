/**
  *
  * main() will be run when you invoke this action
  *
  * @param Cloud Functions actions accept a single parameter, which must be a JSON object.
  *
  * @return The output of this action, which must be a JSON object.
  *
  */
 function main(params) {
   if (params.notification.event_type === 'Object:Write') {
     return { bucket: params.bucket, key: params.key, operation: 'getObject' };
    }
    return { error: 'ignoring docs that are not deleted or modified' };
}
