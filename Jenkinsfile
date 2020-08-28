def notify = [
    email: false,
    slack: [ success: '#danger-bay-build', failure: '#danger-bay-build' ]
]

def projectKey = 'mps-microservice'

node {
    try {
        stage('Cloning Repository') {
            scmCheckout {
                clean = true
            }
        }

        // if we are on the master branch run static code scans
        if(env.GIT_BRANCH =~ /.*master/) {
            stage('Static Code Scan') {
                staticCodeScan {
                    // generic
                    scanners             = ['checkmarx', 'protex']
                    scannerType          = 'javascript'

                    protexProjectName    = 'Danger Bay'
                    // internal, do not change
                    protexBuildName      = 'rrs-generic-protex-build'

                    checkmarxProjectName = "RSD-Danger-Bay-MPS-MicroService"
                }
            }
        }
        
        stage('Prep Base Image') {
            // lets write the file dynamically here so we dont have to add too many ci-related files to the repo
            withCredentials([string(credentialsId: 'github-rsd-service-pat', variable: 'GIT_PASSWORD')]) {
                writeFile(file: 'tmp-git-pass', text: "${GIT_PASSWORD}")
            }

            // this is the base image that will be used to run tests and 
            docker.build('node-builder:latest', '-f Dockerfile.build --build-arg http_proxy --build-arg https_proxy .')

            // remove tmp file from workspace
            sh 'rm -rf tmp-git-pass'
        }

        stage('Test') {
            docker.image('node-builder:latest').inside('-e http_proxy -e https_proxy') {
                    sh 'npm install --unsafe-perm'
                    sh 'npm run test'
            }
        }

        stage('Build') {
            docker.image('node-builder:latest').inside('-e http_proxy -e https_proxy') {
                sh 'npm install --unsafe-perm'
                sh 'npm build'
             }
        }

        // If we are building a docker image
        dockerBuild {
            dockerImageName         =  "${projectKey}"
            dockerRegistry          = 'amr-registry.caas.intel.com/danger-bay'
            dockerBuildOptions      = ['--build-arg BASE=node-builder:latest']
        }

        stage('Cleanup') {
            sh 'docker rmi -f node-builder:latest'
        }
        
        if(notify.email) {
            def buildResult = currentBuild.result ?: 'SUCCESS'
            mail to: notify.email.to, subject: "[${buildResult}] 🙌 ✅ - ${env.JOB_NAME} - Build # ${env.BUILD_NUMBER} 🙌 ✅", body: "${env.BUILD_URL}"
        }

        if(notify.slack) {
            slackBuildNotify {
                slackSuccessChannel = notify.slack.success
            }
        }
    } catch (ex) {
        currentBuild.result = 'FAILURE'

        if(notify.email) {
            mail to: notify.email.to, subject: "[${currentBuild.result}] 💩 😵 - ${env.JOB_NAME} - Build # ${env.BUILD_NUMBER} 👻 😭", body: "${env.BUILD_URL}"
        }

        if(notify.slack) {
            slackBuildNotify {
                failed = true
                slackFailureChannel = notify.slack.failure
                messages = [
                    [ title: 'An Error Occured', text: "The build failed due to: ${ex.getMessage()}" ]
                ]
            }
        }

        throw ex
    }
}
