System.register(["express", "http", "fs", "path", "express-session", "passport", "./middleware/logger.js", "./middleware/error-404.js", "./middleware/error-500.js", "./middleware/error-400.js", "./db/booksdb.js", "./routes/view/books.js", "./routes/api/books.js", "./routes/view/home.js", "./routes/view/user.js", "./routes/api/user.js", "./config/passport.js", "./sockets/commentSocket.js", "./sockets/favoriteSocket.js", "./sockets/socket.js"], function (exports_1, context_1) {
    "use strict";
    var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
    var express_1, http_1, fs_1, path_1, express_session_1, passport_1, logger_js_1, error_404_js_1, error_500_js_1, error_400_js_1, booksdb_js_1, books_js_1, books_js_2, home_js_1, user_js_1, user_js_2, commentSocket_js_1, favoriteSocket_js_1, socket_js_1, app, PORT, server, uploadDir;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (express_1_1) {
                express_1 = express_1_1;
            },
            function (http_1_1) {
                http_1 = http_1_1;
            },
            function (fs_1_1) {
                fs_1 = fs_1_1;
            },
            function (path_1_1) {
                path_1 = path_1_1;
            },
            function (express_session_1_1) {
                express_session_1 = express_session_1_1;
            },
            function (passport_1_1) {
                passport_1 = passport_1_1;
            },
            function (logger_js_1_1) {
                logger_js_1 = logger_js_1_1;
            },
            function (error_404_js_1_1) {
                error_404_js_1 = error_404_js_1_1;
            },
            function (error_500_js_1_1) {
                error_500_js_1 = error_500_js_1_1;
            },
            function (error_400_js_1_1) {
                error_400_js_1 = error_400_js_1_1;
            },
            function (booksdb_js_1_1) {
                booksdb_js_1 = booksdb_js_1_1;
            },
            function (books_js_1_1) {
                books_js_1 = books_js_1_1;
            },
            function (books_js_2_1) {
                books_js_2 = books_js_2_1;
            },
            function (home_js_1_1) {
                home_js_1 = home_js_1_1;
            },
            function (user_js_1_1) {
                user_js_1 = user_js_1_1;
            },
            function (user_js_2_1) {
                user_js_2 = user_js_2_1;
            },
            function (_1) {
            },
            function (commentSocket_js_1_1) {
                commentSocket_js_1 = commentSocket_js_1_1;
            },
            function (favoriteSocket_js_1_1) {
                favoriteSocket_js_1 = favoriteSocket_js_1_1;
            },
            function (socket_js_1_1) {
                socket_js_1 = socket_js_1_1;
            }
        ],
        execute: function () {
            app = express_1.default();
            PORT = process.env.PORT || 3000;
            server = http_1.default.createServer(app);
            socket_js_1.initSocket(server);
            app.set("view engine", "ejs");
            app.use(logger_js_1.logger);
            app.use(express_1.default.json());
            app.use(express_1.default.urlencoded({ extended: true }));
            app.use(express_1.default.static(path_1.default.resolve("public")));
            app.use(express_session_1.default({
                secret: "SECRET",
                resave: false,
                saveUninitialized: false,
                cookie: { secure: false },
            }));
            app.use(passport_1.default.initialize());
            app.use(passport_1.default.session());
            app.use((req, res, next) => {
                res.locals.currentPath = req.path;
                res.locals.message = req.message;
                next();
            });
            app.use("/", home_js_1.default);
            app.use("/api/user", user_js_2.default);
            app.use("/user", user_js_1.default);
            app.use("/books", books_js_1.default);
            app.use("/api/books", books_js_2.default);
            (() => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    yield booksdb_js_1.default();
                    console.log("✅ Database connected");
                }
                catch (error) {
                    console.error("❌ Database connection error:", error);
                    process.exit(1);
                }
            }))();
            uploadDir = path_1.default.resolve("uploads");
            if (!fs_1.default.existsSync(uploadDir)) {
                fs_1.default.mkdirSync(uploadDir);
            }
            app.use("/uploads", express_1.default.static(uploadDir));
            commentSocket_js_1.default();
            favoriteSocket_js_1.default();
            app.use(error_404_js_1.notFound);
            app.use(error_500_js_1.errorHandler);
            app.use(error_400_js_1.badRequest);
            // @ts-ignore
            server.listen(PORT, "0.0.0.0", () => {
                console.log(`🚀 Server is running on http://0.0.0.0:${PORT}`);
            });
        }
    };
});
