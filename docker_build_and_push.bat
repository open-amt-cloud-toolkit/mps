set version=v5
set branch=scale_merge

docker build . -t docker.io/vprodemo/brian_mps:%branch%_%version%
docker push docker.io/vprodemo/brian_mps:%branch%_%version%

pause