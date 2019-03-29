let app = angular.module('contactApp', []);

app.controller('contactController', ($scope, $http) => {

    $scope.cancel_button = true;
    $scope.update_button = true;

    $scope.getContacts = () => {
        $http({
            method: "GET",
            url: "contact/get"
        }).then( (response) => {
            $scope.contact_list = response.data;
        });
    };

    $scope.insertContact = () => {

        $scope.process_value = "Insert";
        $scope.checkValidationInputErrors($scope.contact, $scope.process_value);

    };

    $scope.editContact = (contact) => {

        $scope.contact = angular.copy(contact);

        $scope.insert_button = true;
        $scope.cancel_button = false;
        $scope.update_button = false;

    };  

    $scope.updateContact = () => {

        $scope.process_value = "Update";
        $scope.checkValidationInputErrors($scope.contact, $scope.process_value);

    };

    $scope.cancelButton = () => {
        $scope.insert_button = false;
        $scope.cancel_button = true;
        $scope.update_button = true;
        $scope.contact = {};
        $scope.success = false;
    };

    $scope.deleteContact = (id) => {
        $http({
            method: "DELETE",
            url: "contact/delete/"+id,
        }).then( (response) => {
            if(response.data.status == "Success") {
                $scope.successMessage = response.data.message;
                $scope.success = true;
                $scope.getContacts();
            }
        });
    };

    $scope.checkValidationInputErrors = (contact, processValue) => {

        if ( typeof contact !== 'undefined' ) {

            if ( (typeof contact.name === 'undefined') || (typeof contact.email === 'undefined') || (typeof contact.number === 'undefined') ) {

                if ( typeof contact.name === 'undefined' ) {
                    angular.element( document.querySelector('.in_name') ).addClass('redInputBorder');
                } else {
                    angular.element( document.querySelector('.in_name') ).removeClass('redInputBorder');
                }

                if ( typeof contact.email === 'undefined' ) {
                    angular.element( document.querySelector('.in_email') ).addClass('redInputBorder');
                } else {
                    angular.element( document.querySelector('.in_email') ).removeClass('redInputBorder');
                }

                if ( typeof contact.number === 'undefined' ) {
                    angular.element( document.querySelector('.in_number') ).addClass('redInputBorder');
                } else {
                    angular.element( document.querySelector('.in_number') ).removeClass('redInputBorder');
                }

            } else {
                angular.element( document.querySelector('.in_name') ).removeClass('redInputBorder');
                angular.element( document.querySelector('.in_email') ).removeClass('redInputBorder');
                angular.element( document.querySelector('.in_number') ).removeClass('redInputBorder');

                let contactName = contact.name;
                let contactEmail = contact.email;
                let contactNumber = contact.number;

                $http({
                    method: "POST",
                    url: "contact/insertupdate",
                    data: {
                        id: contact.id,
                        name: contactName,
                        email: contactEmail,
                        number: contactNumber,
                        process_value: processValue
                    }
                }).then( (response) => {
                    if(response.data.status = "Success") {
                        // console.log(response);
                        $scope.successMessage = response.data.message;
                        $scope.success = true;
                        $scope.contact = {};
                        $scope.getContacts();

                        $scope.insert_button = false;
                        $scope.update_button = true;
                        $scope.cancel_button = true;
                    }
                });

            }

        } else {
            angular.element( document.querySelector('.in_name') ).addClass('redInputBorder');
            angular.element( document.querySelector('.in_email') ).addClass('redInputBorder');
            angular.element( document.querySelector('.in_number') ).addClass('redInputBorder');
        }

    };

});