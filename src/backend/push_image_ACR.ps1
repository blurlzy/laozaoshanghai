# push the image to ACR - Azure Container Registry
$acrName="<acr-name>"

# push the image to ACR, Queues a quick build
# --image: The name and tag of the image using the format: '-t repo/image:tag'. Multiple tags are supported by passing -t multiple times.
# --file: The relative path of the the docker file to the source code root folder. Default to 'Dockerfile'.
az acr build --file Host\LaoShanghai.Host\Dockerfile `
             --image laozaoshanghai-api:first `
             --registry $acrName .
