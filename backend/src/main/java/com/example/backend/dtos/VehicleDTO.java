package com.example.backend.dtos;

import com.example.backend.models.Vehicle;
import lombok.Data;

@Data
public class VehicleDTO {
    private Long id;

    private String license;

    private String type;

    private String apartment;

    public static VehicleDTO fromEntity(Vehicle vehicle) {
        VehicleDTO vehicleDTO = new VehicleDTO();

vehicleDTO.setId(vehicle.getId());
        vehicleDTO.setLicense(vehicle.getLicense());
        vehicleDTO.setType(vehicle.getVehicleType().name());
        vehicleDTO.setApartment(vehicle.getApartment().getName());
        return vehicleDTO;
    }

}
