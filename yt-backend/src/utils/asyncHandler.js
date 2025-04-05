const asyncHandler = (requestHandler) => {
    return async (req, res, next) => {
        try {
            await requestHandler(req, res, next);
        } catch (error) {
            res.status(error.statusCode || 500).json({
                success: false,
                messages: error.message,
            });
        }
    };
};
// const asyncHandler = (requestHandler) => {
//     return (req, res, next) => {
//         Promise.resolve(requestHandler(req, res, next)).catch((err) =>
//             next(err)
//         );
//     };
// };
export default asyncHandler;
