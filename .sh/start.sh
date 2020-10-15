if [ "$DEBUG" == "true" ]; then
    case "$START_MODE" in
        "code")
            npm run start:debug
        ;;
        "ut")
            npm run test:debug
        ;;
    esac
else
    case "$START_MODE" in
        "code")
            npm run start
        ;;
        "ut")
            npm run test
        ;;
    esac
fi