#!/usr/bin/env sh

set -e

# staging or production?
BUCKET="dev"
while [ "$1" != "" ]; do
	case $1 in
		--staging )
			shift
			BUCKET="dev"
			;;

		--preprod )
			shift
			BUCKET="preprod"
			;;

		--production )
			shift
			BUCKET="master"
			;;

		* ) shift;;
	esac
done

echo "Preparing production build ..."

echo "Deploying to $BUCKET ..."

CDN_AUTH=$(echo $CDN_AUTH | base64 --decode)
USAT_AUTH=$(echo $USAT_AUTH | base64 --decode)
USCP_AUTH=$(echo $USCP_AUTH | base64 --decode)

CDN_SPACE="gs://delaware-online/storytelling-embeds/$BUCKET/projects"
PUBLIC_PATH="https://www.gannett-cdn.com/delaware-online/storytelling-embeds/$BUCKET/projects"
CDN_PATH="https://$CDN_AUTH@www.gannett-cdn.com/delaware-online/storytelling-embeds/$BUCKET/projects"

PROJECT_SLUG="$(basename $(pwd))"
PROJECT_FOLDER="./build"
PROJECT_FILE='index.html'
PUBLIC_URL="$PUBLIC_PATH/$PROJECT_SLUG/$PROJECT_FILE"

npm run build

sed -i '' 's/\/delaware-online\/storytelling-embeds/https:\/\/www.gannett-cdn.com\/delaware-online\/storytelling-embeds/g' "$PROJECT_FOLDER/index.html"
sed -i '' 's/<head>/''/' "$PROJECT_FOLDER/index.html"
sed -i '' 's/<\/head>/''/' "$PROJECT_FOLDER/index.html"
sed -i '' 's/<noscript>You need to enable JavaScript to run this app.<\/noscript>/''/' "$PROJECT_FOLDER/index.html"

gsutil -m rsync -r $PROJECT_FOLDER "$CDN_SPACE/$PROJECT_SLUG"

gsutil acl -r ch -u AllUsers:R $CDN_SPACE/$PROJECT_SLUG

for f in $(gsutil ls -r "$CDN_SPACE/$PROJECT_SLUG")
do
	echo $f
	curl -X PURGE "${f/gs\:\/\//https://$CDN_AUTH@www.gannett-cdn.com/}" -m 10 &
done

curl -X PURGE "$CDN_PATH/$PROJECT_SLUG" -m 10 &
curl -X PURGE "$CDN_PATH/$PROJECT_SLUG/index.html" -m 10 &

wait
echo "Deployed:"
echo $PUBLIC_URL
