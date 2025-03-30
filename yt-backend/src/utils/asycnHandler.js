const asyncHandler = (requestHandler) => {
    return async (req, res, next) => {
        try {
            await requestHandler(req, res, next);
        } catch (error) {
            res.json({
                success: false,
                messages: error.message,
            });
        }
    };
};

export default asyncHandler;
