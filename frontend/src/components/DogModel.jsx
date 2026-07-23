import { useGLTF } from "@react-three/drei";

export default function DogModel(props) {
    const { scene } = useGLTF("/models/cute puppy 3d model_Clone1.glb");

    return (
        <primitive
            object={scene}
            scale={1}
            position={[0, 0, 0]}
            {...props}
        />
    );
}

useGLTF.preload("/models/cute puppy 3d model_Clone1.glb");